openssl genrsa -des3 -passout pass:x -out server.pass.key 2048 -sha256 -extfile v3.ext
openssl rsa -passin pass:x -in server.pass.key -out server.key
rm server.pass.key
openssl req \
    -new \
    -key server.key \
    -x509 \
    -out server.crt \
    -subj /CN=localhost \
    -reqexts SAN \
    -extensions SAN \
    -config <(cat /System/Library/OpenSSL/openssl.cnf \
        <(printf '[SAN]\nsubjectAltName=DNS:localhost')) \
    -sha256 \
    -days 3650
