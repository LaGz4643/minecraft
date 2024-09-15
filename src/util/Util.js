class Util {
    static make(o, consumer) {
        consumer(o);
        return o;
    }

    static async readAll(filePath) {
        if (!Main.ALLOW_FILE_ACCESS) {
            switch (filePath) {
                case "assets/shaders/shader.vsh":
                    return "attribute vec4 a_Position;\nattribute vec4 a_Color;\nattribute vec2 a_TexCoord;\nuniform mat4 u_ViewProjectionMatrix;\nvarying vec4 v_Color;\nvarying vec2 v_TexCoord;\nvoid main() {\n  gl_Position = u_ViewProjectionMatrix * a_Position;\n  v_Color = a_Color;\n  v_TexCoord = a_TexCoord;\n}";
                case "assets/shaders/shader.fsh":
                    return "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform sampler2D u_Sampler;\nvarying vec4 v_Color;\nvarying vec2 v_TexCoord;\nvoid main() {\n  gl_FragColor = texture2D(u_Sampler, v_TexCoord) * v_Color;\n}";
            }
        }
        return fetch(filePath).then((response) => response.text());
    }

    static sumArray(array) {
        return array.reduce((sum, element) => sum + element);
    }

    static averageArray(array) {
        return Util.sumArray(array) / array.length;
    }
}