export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Login page
    if (
  request.method === "GET" &&
  (url.pathname === "/login" || url.pathname === "/login/")
) {
      return new Response(`<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SMART TPS B3 - Login</title>
<style>
body{font-family:Arial;margin:0;background:#eef3f7;display:grid;place-items:center;height:100vh}
.box{background:#fff;padding:28px;border-radius:12px;box-shadow:0 2px 12px #0002;width:min(360px,88vw)}
h2{margin-top:0}input,button{width:100%;padding:12px;margin-top:10px;box-sizing:border-box}
button{background:#0b8f55;color:#fff;border:0;border-radius:6px;font-weight:bold}
</style></head>
<body><div class="box">
<h2>SMART TPS LIMBAH B3</h2>
<p>Masukkan kode akses.</p>
<form method="POST" action="/login">
<input name="kode" type="password" placeholder="Kode akses" required autofocus>
<button>MASUK</button>
</form>
</div></body></html>`, {
        headers: {"content-type":"text/html; charset=UTF-8"}
      });
    }

    if (request.method === "POST" && url.pathname === "/login") {
      const form = await request.formData();
      const kode = String(form.get("kode") || "");

      let role = "";
      if (kode === env.VIEWER_CODE) role = "viewer";
      if (kode === env.ADMIN_CODE) role = "admin";

      if (!role) {
        return new Response("Kode akses salah. <a href='/login'>Kembali</a>", {
          status: 401,
          headers: {"content-type":"text/html; charset=UTF-8"}
        });
      }

      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": `b3_role=${role}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`
        }
      });
    }

    // Logout
    if (url.pathname === "/logout") {
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/login",
          "Set-Cookie": "b3_role=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
        }
      });
    }

// =========================
// HISTORY PRODUKSI - READ
// =========================

if (
  request.method === "OPTIONS" &&
  url.pathname === "/api/history"
) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://helmismd.github.io",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true"
    }
  });
}

if (
  request.method === "GET" &&
  url.pathname === "/api/history"
) {

  const api =
    "https://api.github.com/repos/helmismd/dashboard-produksi/contents/history.json";

  const response = await fetch(api, {
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "SMART-TPS-B3"
    }
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        error: "Gagal membaca history.json",
        status: response.status
      }),
      {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://helmismd.github.io"
        }
      }
    );
  }

  const fileInfo = await response.json();

  const binary = atob(
    fileInfo.content.replace(/\n/g, "")
  );

  const bytes = Uint8Array.from(
    binary,
    c => c.charCodeAt(0)
  );

  const text = new TextDecoder().decode(bytes);

  return new Response(text, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "https://helmismd.github.io",
      "Access-Control-Allow-Credentials": "true"
    }
  });
}

// =========================
// API SILO
// =========================

if (
    request.method === "GET" &&
    url.pathname === "/api/silo"
) {

    const api =
        "https://api.github.com/repos/helmismd/smart-tps-b3/contents/data.json";

    try {

        const response = await fetch(api, {
            headers: {
                "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
                "Accept": "application/vnd.github+json",
                "User-Agent": "SMART-TPS-B3"
            }
        });

        if (!response.ok) {

            return new Response(
                JSON.stringify({
                    error: "Gagal membaca data.json",
                    status: response.status
                }),
                {
                    status: response.status,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin":
                            "https://helmismd.github.io",
"Access-Control-Allow-Credentials": "true"
                    }
                }
            );
        }

        const fileInfo = await response.json();

        const binary = atob(
            fileInfo.content.replace(/\n/g, "")
        );

        const bytes = Uint8Array.from(
            binary,
            c => c.charCodeAt(0)
        );

        const text =
            new TextDecoder().decode(bytes);

        return new Response(text, {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
                "Access-Control-Allow-Origin":
                    "https://helmismd.github.io",
"Access-Control-Allow-Credentials": "true"
            }
        });

    } catch (e) {

        return new Response(
            JSON.stringify({
                error: e.message
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":
                        "https://helmismd.github.io",
"Access-Control-Allow-Credentials": "true"
                }
            }
        );
    }
}

    // Protect the application
    const cookie = request.headers.get("Cookie") || "";
    const match = cookie.match(/(?:^|;\s*)b3_role=(viewer|admin)(?:;|$)/);
    if (!match) {
      return Response.redirect(new URL("/login", request.url), 302);
    }

    // For now this is a viewer/admin gate only.
    // The existing app remains a static viewer until its data-write mechanism is added.
    // =========================
// CEK ROLE UNTUK APLIKASI
// =========================
// =========================
// SIMPAN DATABASE KE GITHUB
// =========================
if (
  request.method === "POST" &&
  url.pathname === "/api/db"
) {

  // Hanya ADMIN yang boleh menyimpan
  if (match[1] !== "admin") {
    return new Response(
      JSON.stringify({
        error: "Akses ditolak. Hanya admin yang dapat menyimpan data."
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {

    const data = await request.text();

    const api =
      "https://api.github.com/repos/helmismd/smart-tps-b3/contents/data.json";

    // Ambil SHA data.json terbaru
    const getFile = await fetch(api, {
      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "SMART-TPS-B3"
      }
    });

    if (!getFile.ok) {
      throw new Error(
        "Gagal membaca data.json: " + getFile.status
      );
    }

    const fileInfo = await getFile.json();

    // Ubah data menjadi Base64
    const bytes = new TextEncoder().encode(data);

    let binary = "";

    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    const content = btoa(binary);

    // Simpan ke GitHub
    const saveFile = await fetch(api, {
      method: "PUT",

      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "SMART-TPS-B3"
      },

      body: JSON.stringify({
        message: "Update data SMART TPS B3",
        content: content,
        sha: fileInfo.sha
      })
    });

    if (!saveFile.ok) {

      const errorText = await saveFile.text();

      throw new Error(
        "Gagal menyimpan data.json: " +
        saveFile.status +
        " " +
        errorText
      );
    }

    return new Response(
      JSON.stringify({
        success: true
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (e) {

    return new Response(
      JSON.stringify({
        success: false,
        error: e.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  }
}

// =========================
// HISTORY PRODUKSI
// =========================

// =========================
// API HISTORY PRODUKSI
// =========================

if (
  request.method === "OPTIONS" &&
  url.pathname === "/api/history"
) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://helmismd.github.io",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true"
    }
  });
}

if (
  request.method === "GET" &&
  url.pathname === "/api/history"
) {

  try {

    const api =
      "https://api.github.com/repos/helmismd/dashboard-produksi/contents/history.json";

    const response = await fetch(api, {
      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "SMART-TPS-B3"
      }
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Gagal membaca history.json",
          status: response.status
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://helmismd.github.io",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }

    const fileInfo = await response.json();

    const binary = atob(
      fileInfo.content.replace(/\n/g, "")
    );

    const bytes = Uint8Array.from(
      binary,
      c => c.charCodeAt(0)
    );

    const text = new TextDecoder().decode(bytes);

    return new Response(text, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "https://helmismd.github.io",
        "Access-Control-Allow-Credentials": "true"
      }
    });

  } catch (e) {

    return new Response(
      JSON.stringify({
        error: e.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://helmismd.github.io",
          "Access-Control-Allow-Credentials": "true"
        }
      }
    );
  }
}

if (url.pathname === "/api/role") {

  return new Response(
    JSON.stringify({
      role: match[1]
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    }
  );

}


// =========================
// TAMPILKAN APLIKASI
// =========================
return env.ASSETS.fetch(request);
  }
};
