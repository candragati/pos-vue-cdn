from livereload import Server


def main():
    server = Server()

    # File utama
    server.watch("index.html")

    # Asset statis
    server.watch("assets/")
    server.watch("js/")

    # Modul POS
    server.watch("modules/")

    server.serve(root=".", host="0.0.0.0", port=8000, open_url=False, debug=True)


if __name__ == "__main__":
    main()
