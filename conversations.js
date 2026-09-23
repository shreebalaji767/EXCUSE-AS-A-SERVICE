"use strict";

const DATA = window.EXCUSE_DATA || {};

const conversations =
    Array.isArray(DATA.conversations)
        ? DATA.conversations
        : [];

const container =
    document.getElementById("conversationContainer");

const countSelect =
    document.getElementById("conversationCount");

const generateButton =
    document.getElementById("generateConversations");

const generateMoreButton =
    document.getElementById("generateMore");

const resultHeading =
    document.getElementById("resultHeading");

const usedIndexes = new Set();


/* =========================================================
   RANDOM CONVERSATION
========================================================= */

function getRandomConversation() {

    if (!conversations.length) {
        return null;
    }

    if (usedIndexes.size >= conversations.length) {
        usedIndexes.clear();
    }

    let index;

    do {
        index = Math.floor(
            Math.random() * conversations.length
        );
    } while (
        usedIndexes.has(index) &&
        usedIndexes.size < conversations.length
    );

    usedIndexes.add(index);

    return conversations[index];
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   COPY
========================================================= */

async function copyConversation(conversation) {

    const messages = Array.isArray(conversation.messages)
        ? conversation.messages
        : [];

    const text = messages
        .map(message =>
            `${message.speaker}: ${message.text}`
        )
        .join("\n");

    try {

        await navigator.clipboard.writeText(text);

        alert("Conversation copied.");

    } catch {

        const textarea =
            document.createElement("textarea");

        textarea.value = text;

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand("copy");

        textarea.remove();

        alert("Conversation copied.");
    }
}


/* =========================================================
   SCREENSHOT
========================================================= */

function screenshotConversation(card) {

    const canvas =
        document.createElement("canvas");

    const width = 1200;

    const height =
        Math.max(
            600,
            card.scrollHeight + 100
        );

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

    ctx.font =
        "bold 32px Arial";

    ctx.fillText(
        "☠️ EXCUSE-AS-A-SERVICE",
        50,
        60
    );

    let y = 120;

    const messages =
        card.querySelectorAll(".conversation-message");

    messages.forEach(message => {

        const speaker =
            message.querySelector(
                ".message-speaker"
            );

        const text =
            message.querySelector(
                ".message-text"
            );

        ctx.font =
            "bold 22px Arial";

        ctx.fillStyle =
            "#ffffff";

        ctx.fillText(
            speaker.innerText,
            50,
            y
        );

        y += 34;

        ctx.font =
            "20px Arial";

        ctx.fillStyle =
            "#cccccc";

        const words =
            text.innerText.split(" ");

        let line = "";

        const maxWidth = 1080;

        words.forEach(word => {

            const test =
                line
                ? `${line} ${word}`
                : word;

            if (
                ctx.measureText(test).width
                > maxWidth
            ) {

                ctx.fillText(
                    line,
                    50,
                    y
                );

                y += 30;

                line = word;

            } else {

                line = test;
            }
        });

        if (line) {

            ctx.fillText(
                line,
                50,
                y
            );

            y += 30;
        }

        y += 25;
    });

    const link =
        document.createElement("a");

    link.download =
        "excuse-conversation.png";

    link.href =
        canvas.toDataURL("image/png");

    link.click();
}


/* =========================================================
   CREATE CARD
========================================================= */

function createConversationCard(
    conversation,
    number
) {

    const card =
        document.createElement("article");

    card.className =
        "conversation-card";


    /* HEADER */

    const header =
        document.createElement("div");

    header.className =
        "conversation-header";

    header.innerHTML = `
        <div>
            <div class="conversation-number">
                CONVERSATION #${number}
            </div>

            <h2>
                ${escapeHTML(conversation.title)}
            </h2>
        </div>

        <div class="style-badge">
            ${escapeHTML(
                conversation.style || "RANDOM"
            )}
        </div>
    `;

    card.appendChild(header);


    /* MESSAGES */

    const messages =
        Array.isArray(conversation.messages)
            ? conversation.messages
            : [];

    const dialogue =
        document.createElement("div");

    dialogue.className =
        "conversation-dialogue";


    if (!messages.length) {

        dialogue.innerHTML = `
            <div class="empty-conversation">
                NO DIALOGUE FOUND
            </div>
        `;

    } else {

        messages.forEach(message => {

            const row =
                document.createElement("div");

            row.className =
                "conversation-message";

            row.innerHTML = `
                <div class="message-speaker">
                    ${escapeHTML(
                        message.speaker
                    )}
                </div>

                <div class="message-text">
                    ${escapeHTML(
                        message.text
                    )}
                </div>
            `;

            dialogue.appendChild(row);
        });
    }

    card.appendChild(dialogue);


    /* ACTIONS */

    const actions =
        document.createElement("div");

    actions.className =
        "conversation-actions";

    const copyButton =
        document.createElement("button");

    copyButton.type = "button";

    copyButton.className =
        "conversation-action";

    copyButton.textContent =
        "COPY";

    copyButton.addEventListener(
        "click",
        () => copyConversation(conversation)
    );


    const screenshotButton =
        document.createElement("button");

    screenshotButton.type =
        "button";

    screenshotButton.className =
        "conversation-action";

    screenshotButton.textContent =
        "SCREENSHOT";

    screenshotButton.addEventListener(
        "click",
        () => screenshotConversation(card)
    );


    actions.appendChild(copyButton);
    actions.appendChild(screenshotButton);

    card.appendChild(actions);

    return card;
}


/* =========================================================
   GENERATE
========================================================= */

function generateConversations() {

    if (!container) {
        return;
    }

    let amount =
        Number(
            countSelect?.value || 5
        );

    if (!Number.isFinite(amount)) {
        amount = 5;
    }

    amount =
        Math.max(
            1,
            Math.min(
                amount,
                50
            )
        );


    container.innerHTML = "";


    if (!conversations.length) {

        container.innerHTML = `
            <div class="empty-conversation">
                NO CONVERSATIONS FOUND.
                <br><br>
                RUN build/generate.py FIRST.
            </div>
        `;

        return;
    }


    for (
        let i = 1;
        i <= amount;
        i++
    ) {

        const conversation =
            getRandomConversation();

        if (!conversation) {
            break;
        }

        const card =
            createConversationCard(
                conversation,
                i
            );

        container.appendChild(card);
    }


    if (resultHeading) {

        resultHeading.textContent =
            `${amount} RANDOM CONVERSATION${
                amount === 1 ? "" : "S"
            }`;
    }
}


/* =========================================================
   EVENTS
========================================================= */

if (countSelect) {

    countSelect.addEventListener(
        "change",
        generateConversations
    );
}


if (generateButton) {

    generateButton.addEventListener(
        "click",
        generateConversations
    );
}


if (generateMoreButton) {

    generateMoreButton.addEventListener(
        "click",
        generateConversations
    );
}


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        generateConversations();

    }
);
