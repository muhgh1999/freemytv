package com.freemytv.app

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.media.tv.TvContract
import android.media.tv.TvInputInfo
import android.media.tv.TvInputManager
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.Toast
import org.json.JSONArray
import org.json.JSONObject

@SuppressLint("SetJavaScriptEnabled")
fun setupWeb(w: WebView, ctx: Context, url: String) {
    w.settings.javaScriptEnabled = true
    w.settings.domStorageEnabled = true
    w.settings.allowFileAccess = true
    @Suppress("DEPRECATION")
    w.settings.allowUniversalAccessFromFileURLs = true
    w.setBackgroundColor(0xFF111111.toInt())
    w.isFocusable = true
    w.isFocusableInTouchMode = true
    w.addJavascriptInterface(Bridge(ctx), "Android")
    w.loadUrl(url)
}

class Bridge(private val a: Context) {
    private fun ui(f: () -> Unit) { Handler(Looper.getMainLooper()).post(f) }
    private fun toast(s: String) = ui { Toast.makeText(a, s, Toast.LENGTH_SHORT).show() }
    private fun go(i: Intent) {
        try { a.startActivity(i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) } catch (e: Exception) { toast("تعذّر الفتح") }
    }

    @JavascriptInterface fun launch(pkg: String) {
        val pm = a.packageManager
        val i = pm.getLeanbackLaunchIntentForPackage(pkg) ?: pm.getLaunchIntentForPackage(pkg)
        if (i != null) go(i) else toast("التطبيق غير منصّب")
    }

    @JavascriptInterface fun apps(): String {
        val pm = a.packageManager
        val seen = HashSet<String>()
        val arr = JSONArray()
        for (cat in listOf(Intent.CATEGORY_LEANBACK_LAUNCHER, Intent.CATEGORY_LAUNCHER)) {
            for (r in pm.queryIntentActivities(Intent(Intent.ACTION_MAIN).addCategory(cat), 0)) {
                val p = r.activityInfo.packageName
                if (p == a.packageName || !seen.add(p)) continue
                arr.put(JSONObject().put("n", r.loadLabel(pm).toString()).put("p", p))
            }
        }
        return arr.toString()
    }

    @JavascriptInterface fun input(kind: String) {
        if (kind == "tv") { go(Intent(Intent.ACTION_VIEW, TvContract.Channels.CONTENT_URI)); return }
        try {
            val tm = a.getSystemService(Context.TV_INPUT_SERVICE) as TvInputManager
            val hdmi = tm.tvInputList.filter { it.type == TvInputInfo.TYPE_HDMI }.sortedBy { it.id }
            val key = kind.uppercase()
            val t = hdmi.firstOrNull { it.loadLabel(a).toString().replace(" ", "").uppercase().contains(key) }
                ?: hdmi.getOrNull(kind.removePrefix("hdmi").toInt() - 1)
            if (t == null) { toast("المدخل غير موجود"); return }
            go(Intent(Intent.ACTION_VIEW, TvContract.buildChannelUriForPassthroughInput(t.id)))
        } catch (e: Exception) { toast("تعذّر فتح المدخل") }
    }

    @JavascriptInterface fun settings() { go(Intent(Settings.ACTION_SETTINGS)) }
}
