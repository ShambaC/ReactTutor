mod http;
mod oauth;
mod sys;

use tauri::{Manager, RunEvent};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    // the mic button (speech to text) is the app's own feature; don't make students answer a browser prompt for it
    .on_permission_request(|w, kind| match kind {
      tauri::webview::PermissionKind::Microphone if w.label() == "main" => tauri::webview::PermissionResponse::Allow,
      _ => tauri::webview::PermissionResponse::Default,
    })
    .setup(|app| {
      app.manage(sys::Tts::default());
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      http::http_request,
      http::http_stream,
      oauth::oauth_login,
      oauth::oauth_cancel,
      oauth::oauth_ensure,
      oauth::oauth_status,
      oauth::oauth_logout,
      sys::secret_set,
      sys::secret_delete,
      sys::secret_exists,
      sys::run_cli,
      sys::hw_info,
      sys::tts_status,
      sys::tts_setup,
      sys::tts_start,
      sys::tts_stop,
      sys::install_uv,
    ])
    .build(tauri::generate_context!())
    .expect("error while building tauri application")
    .run(|app, event| {
      if let RunEvent::Exit = event {
        sys::stop_tts(&app.state());
      }
    });
}
