/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

const ua = navigator.userAgent;
const os = ua.includes("Windows") ? "Windows" : ua.includes("Mac OS") ? "Mac OS X" : "Linux";

const originalSend = WebSocket.prototype.send;

WebSocket.prototype.send = function (this: WebSocket, data) {
    if (typeof data === "string" && data.includes('"op":2') && this.url.includes("gateway")) {
        try {
            const payload = JSON.parse(data);
            if (payload.op === 2 && payload.d?.properties) {
                Object.assign(payload.d.properties, {
                    os,
                    browser: "Discord Client",
                    device: ""
                });
                data = JSON.stringify(payload);
            }
        } catch {}
    }

    return originalSend.call(this, data);
};
