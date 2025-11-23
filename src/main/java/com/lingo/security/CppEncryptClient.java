// CppEncryptClient.java
package com.example.lingo.util;

import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class CppEncryptClient {
    private final String host;
    private final int port;
    private final String authToken;

    public CppEncryptClient(String host, int port, String authToken) {
        this.host = host;
        this.port = port;
        this.authToken = authToken;
    }

    private String sendCommand(String cmd) throws IOException {
        try (Socket socket = new Socket(host, port);
             OutputStream os = socket.getOutputStream();
             InputStream is = socket.getInputStream()) {

            // First send AUTH line
            String authLine = "AUTH:" + authToken + "\n";
            os.write(authLine.getBytes(StandardCharsets.UTF_8));

            // Then the actual command (ENCRYPT:... or DECRYPT:...)
            os.write(cmd.getBytes(StandardCharsets.UTF_8));
            os.flush();
            socket.shutdownOutput();

            BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
            String line = br.readLine();
            return line;
        }
    }

    public String encrypt(String plaintext) throws IOException {
        String res = sendCommand("ENCRYPT:" + plaintext + "\n");
        if (res == null) throw new IOException("No response");
        if (res.startsWith("OK:")) return res.substring(3);
        throw new IOException("Error from encryptor: " + res);
    }

    public String decrypt(String b64cipher) throws IOException {
        String res = sendCommand("DECRYPT:" + b64cipher + "\n");
        if (res == null) throw new IOException("No response");
        if (res.startsWith("OK:")) return res.substring(3);
        throw new IOException("Error from encryptor: " + res);
    }
}