"use strict";

const data = window.EXCUSE_DATA;

const container =
    document.getElementById(
        "conversationContainer"
    );

const used = new Set();

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function randomIndex(max) {

    return Math.floor(
        Math.random() * max
    );
}

function getRandomConversation() {

    if (
        used.size >=
        data.conversations.length
    ) {
        used.clear();
    }

    let index;

    do {

        index =
            randomIndex(
                data.conversations.length
            );

    } while (used.has(index));

    used.add(index);

    return data.conversations[index];
}

function render(conversation) {

    return `

        <article class="conversation-card">

            <div class="conversation-header">

                <span>
                    ${escapeHTML(
                        conversation.title
                    )}
                </span>

                <span class="badge">
                    ${escapeHTML(
                        conversation.style
                    )}
                </span>

            </div>

            <div class="chat">

                ${conversation.lines.map(line => `

                    <div class="message">

                        <div class="speaker">
                            ${escapeHTML(
                                line.speaker
                            )}
                        </div>

                        <div class="bubble">
                            ${escapeHTML(
                                line.text
                            )}
                        </div>

                    </div>

                `).join("")}

            </div>

            <div class="conversation-actions">

                <button
                    onclick="copyConversation(${conversation.id})"
                >
                    COPY
                </button>

                <button
                    onclick="makeScreenshot(${conversation.id})"
                >
                    📸 SCREENSHOT
                </button>

            </div>

        </article>

    `;
}

function showRandomConversation() {

    const conversation =
        getRandomConversation();

    container.innerHTML =
        render(conversation);
}

function findConversation(id) {

    return data.conversations.find(
        item => item.id === id
    );
}

function copyConversation(id) {

    const conversation =
        findConversation(id);

    if (!conversation) {
        return;
    }

    const text =
        conversation.lines
            .map(
                line =>
                    `${line.speaker}: ${line.text}`
            )
            .join("\n\n");

    navigator.clipboard
        .writeText(text)
        .then(() => alert("Copied."));
}

function makeScreenshot(id) {

    const conversation =
        findConversation(id);

    if (!conversation) {
        return;
    }

    const canvas =
        document.createElement("canvas");

    const width = 1200;
    const height = 700;

    canvas.width = width;
    canvas.height = height;

    const ctx =
        canvas.getContext("2d");

    ctx.fillStyle = "#090909";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

    ctx.fillStyle = "#ffffff";

    ctx.textAlign = "center";

    ctx.font =
        "bold 42px Arial";

    ctx.fillText(
        "☠️ EXCUSE-AS-A-SERVICE",
        width / 2,
        70
    );

    ctx.font =
        "bold 28px Arial";

    ctx.fillStyle = "#dddddd";

    ctx.fillText(
        conversation.title,
        width / 2,
        120
    );

    ctx.textAlign = "left";

    let y = 190;

    conversation.lines.forEach(line => {

        ctx.font =
            "bold 22px Arial";

        ctx.fillStyle =
            "#999999";

        ctx.fillText(
            line.speaker,
            90,
            y
        );

        y += 32;

        ctx.font =
            "22px Arial";

        ctx.fillStyle =
            "#ffffff";

        const words =
            line.text.split(" ");

        let current = "";

        for (const word of words) {

            const test =
                current
                    ? current + " " + word
                    : word;

            if (
                ctx.measureText(test).width >
                1000
            ) {

                ctx.fillText(
                    current,
                    90,
                    y
                );

                y += 32;

                current = word;

            } else {

                current = test;

            }

        }

        if (current) {

            ctx.fillText(
                current,
                90,
                y
            );

            y += 32;
        }

        y += 35;

    });

    canvas.toBlob(async blob => {

        if (!blob) {
            return;
        }

        const file =
            new File(
                [blob],
                "conversation.png",
                {
                    type: "image/png"
                }
            );

        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({
                files: [file]
            })
        ) {

            await navigator.share({
                title:
                    "Excuse-as-a-Service",
                files: [file]
            });

        } else {

            const link =
                document.createElement("a");

            link.download =
                "conversation.png";

            link.href =
                URL.createObjectURL(blob);

            link.click();

            URL.revokeObjectURL(
                link.href
            );
        }

    }, "image/png");
}

showRandomConversation();
