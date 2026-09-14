import http.server
import socketserver
import urllib.request
import urllib.error
import sys

TARGET_PORT = 3002
LISTEN_PORT = 3000

class ThreadingProxyServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        self._proxy()
    def do_POST(self):
        self._proxy()
    def do_HEAD(self):
        self._proxy()
    def do_OPTIONS(self):
        self._proxy()

    def _proxy(self):
        url = f"http://127.0.0.1:{TARGET_PORT}{self.path}"
        headers = {}
        for k, v in self.headers.items():
            if k.lower() not in ["host", "connection"]:
                headers[k] = v
        headers["Host"] = f"127.0.0.1:{TARGET_PORT}"

        body = None
        content_len = int(self.headers.get("Content-Length", 0))
        if content_len > 0:
            body = self.rfile.read(content_len)

        req = urllib.request.Request(url, data=body, headers=headers, method=self.command)
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                self.send_response(resp.status)
                for k, v in resp.getheaders():
                    if k.lower() not in ["transfer-encoding", "connection"]:
                        self.send_header(k, v)
                self.end_headers()
                if self.command != "HEAD":
                    self.wfile.write(resp.read())
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            for k, v in e.headers.items():
                if k.lower() not in ["transfer-encoding", "connection"]:
                    self.send_header(k, v)
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(e.read())
        except Exception as e:
            self.send_error(502, f"Bad Gateway: {str(e)}")

    def log_message(self, format, *args):
        pass

if __name__ == "__main__":
    print(f"Starting Python reverse proxy on 0.0.0.0:{LISTEN_PORT} -> 127.0.0.1:{TARGET_PORT}")
    server = ThreadingProxyServer(("0.0.0.0", LISTEN_PORT), ProxyHandler)
    server.serve_forever()