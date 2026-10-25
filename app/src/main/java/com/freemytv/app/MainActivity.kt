package com.freemytv.app

import android.app.Activity
import android.os.Bundle
import android.service.dreams.DreamService
import android.view.KeyEvent
import android.webkit.WebView

class MainActivity : Activity() {
    private lateinit var w: WebView
    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        w = WebView(this)
        setContentView(w)
        setupWeb(w, this, "file:///android_asset/index.html")
    }
    override fun onKeyDown(k: Int, e: KeyEvent): Boolean {
        if (k == KeyEvent.KEYCODE_BACK) { w.evaluateJavascript("window.onBack&&window.onBack()", null); return true }
        return super.onKeyDown(k, e)
    }
    override fun onResume() {
        super.onResume()
        w.onResume()
        w.evaluateJavascript("window.onShow&&window.onShow()", null)
    }
    override fun onPause() { w.onPause(); super.onPause() }
}

class SaverService : DreamService() {
    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        isInteractive = false
        isFullscreen = true
        val w = WebView(this)
        setContentView(w)
        setupWeb(w, this, "file:///android_asset/index.html#saver")
    }
}
