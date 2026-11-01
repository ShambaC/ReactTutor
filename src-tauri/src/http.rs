// HTTP for AI providers: runs in Rust so API keys stay in the keychain (`{{secret:NAME}}` header templates)
// and the webview never needs CORS. Trimmed from Scout's http.rs (no proxy, rate limits or downloads).
use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::OnceLock, time::Duration};
use tauri::ipc::Channel;

#[derive(Deserialize)]
pub struct HttpRequest {
    method: Option<String>,
    url: String,
    headers: Option<HashMap<String, String>>,
    body: Option<String>,
    timeout_ms: Option<u64>,
}

#[derive(Serialize)]
pub struct HttpResponse {
    status: u16,
    body: String,
}

fn fill_secrets(v: &str) -> Result<String, String> {
    let mut out = String::new();
    let mut rest = v;
    while let Some(i) = rest.find("{{secret:") {
        out.push_str(&rest[..i]);
        let after = &rest[i + 9..];
        let j = after.find("}}").ok_or("unterminated {{secret:}}")?;
        let name = &after[..j];
        let val = crate::sys::secret_entry(name)?.get_password().map_err(|e| format!("secret {name}: {e}"))?;
        out.push_str(&val);
        rest = &after[j + 2..];
    }
    out.push_str(rest);
    Ok(out)
}

fn client() -> &'static reqwest::Client {
    static C: OnceLock<reqwest::Client> = OnceLock::new();
    C.get_or_init(|| reqwest::Client::builder().connect_timeout(Duration::from_secs(30)).build().expect("http client"))
}

/// reqwest's Display hides the cause ("error sending request"); append the source chain.
fn explain(e: reqwest::Error) -> String {
    let e = e.without_url();
    let mut out = e.to_string();
    let mut src = std::error::Error::source(&e);
    while let Some(s) = src {
        out.push_str(": ");
        out.push_str(&s.to_string());
        src = s.source();
    }
    out
}

async fn send(req: &HttpRequest) -> Result<reqwest::Response, String> {
    let mut headers = reqwest::header::HeaderMap::new();
    for (k, v) in req.headers.iter().flatten() {
        headers.insert(
            reqwest::header::HeaderName::from_bytes(k.as_bytes()).map_err(|e| e.to_string())?,
            fill_secrets(v)?.parse().map_err(|_| format!("bad header value for {k}"))?,
        );
    }
    let method = reqwest::Method::from_bytes(req.method.as_deref().unwrap_or("GET").as_bytes()).map_err(|e| e.to_string())?;
    let mut rb = client().request(method, &req.url).headers(headers);
    if let Some(b) = &req.body {
        rb = rb.body(b.clone());
    }
    let timeout = Duration::from_millis(req.timeout_ms.unwrap_or(120_000));
    tokio::time::timeout(timeout, rb.send()).await.map_err(|_| "timed out waiting for response".to_string())?.map_err(explain)
}

#[tauri::command]
pub async fn http_request(req: HttpRequest) -> Result<HttpResponse, String> {
    let resp = send(&req).await?;
    let status = resp.status().as_u16();
    Ok(HttpResponse { status, body: resp.text().await.map_err(|e| e.without_url().to_string())? })
}

/// Appends `chunk` to `carry`, returns the decodable text and leaves an incomplete trailing multi-byte sequence in `carry`.
fn take_utf8(carry: &mut Vec<u8>, chunk: &[u8]) -> String {
    carry.extend_from_slice(chunk);
    let n = match std::str::from_utf8(carry) {
        Err(e) if e.error_len().is_none() => e.valid_up_to(),
        _ => carry.len(),
    };
    let s = String::from_utf8_lossy(&carry[..n]).into_owned();
    carry.drain(..n);
    s
}

/// Streams a 2xx body to `on_chunk` as UTF-8 pieces, then "" as the end marker; error bodies come back in `body`.
#[tauri::command]
pub async fn http_stream(req: HttpRequest, on_chunk: Channel<String>) -> Result<HttpResponse, String> {
    let resp = send(&req).await?;
    let status = resp.status();
    if !status.is_success() {
        return Ok(HttpResponse { status: status.as_u16(), body: resp.text().await.map_err(|e| e.without_url().to_string())? });
    }
    let idle = Duration::from_millis(req.timeout_ms.unwrap_or(120_000));
    let (mut carry, mut s) = (Vec::new(), resp.bytes_stream());
    while let Some(c) = tokio::time::timeout(idle, s.next()).await.map_err(|_| "stream idle timeout")? {
        let t = take_utf8(&mut carry, &c.map_err(|e| e.without_url().to_string())?);
        if !t.is_empty() {
            on_chunk.send(t).map_err(|e| e.to_string())?;
        }
    }
    if !carry.is_empty() {
        on_chunk.send(String::from_utf8_lossy(&carry).into_owned()).map_err(|e| e.to_string())?;
    }
    on_chunk.send(String::new()).map_err(|e| e.to_string())?;
    Ok(HttpResponse { status: status.as_u16(), body: String::new() })
}

#[cfg(test)]
mod tests {
    use super::take_utf8;

    #[test]
    fn utf8_split_across_chunks() {
        let b = "a€b".as_bytes();
        let mut carry = Vec::new();
        assert_eq!(take_utf8(&mut carry, &b[..2]), "a");
        assert_eq!(take_utf8(&mut carry, &b[2..3]), "");
        assert_eq!(take_utf8(&mut carry, &b[3..]), "€b");
        assert!(carry.is_empty());
    }
}
