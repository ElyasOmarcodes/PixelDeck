// PixelDeck desktop shell.
//
// The whole editor is the existing web app loaded from the bundled `dist/`, so
// this binary exists only to host a webview window. There are deliberately no
// Tauri commands and no plugins: projects live in localStorage/IndexedDB and
// exports go through the webview's own download path, which keeps the shell
// permissionless and the binary small.

// Hides the console window that Windows would otherwise open behind the app.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("failed to start the PixelDeck window");
}
