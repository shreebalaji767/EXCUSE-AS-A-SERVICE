"use strict";

const data = window.EXCUSE_DATA;

const questionInput = document.getElementById("question");
const styleInput = document.getElementById("style");
const amountInput = document.getElementById("amount");
const generateButton = document.getElementById("generate");
const result = document.getElementById("result");

let currentBatch = [];
let usedIndexes = new Set();

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function randomIndex(max) {
    return Math.floor(Math.random() * max);
}

function getUnusedConversation() {

    if (usedIndexes.size >= data.conversations.length) {
        usedIndexes.clear();
    }

    let index;

    do {
        index = randomIndex(data.conversations.length);
    } while (usedIndexes.has(index));

    usedIndexes.add(index);

    return data.conversations[index];
}

function makeExcuse(question, style) {

    const templates = data.excuseTemplates[style]
        || data.excuseTemplates.believable;

    const template = templates[
        randomIndex(templates.length)
    ];

    const cleanedQuestion = question.trim();

    return {
        question: cleanedQuestion,
        answer: template
    };
}

function renderConversation(conversation) {

    return `
        <article class="conversation-card">

            <div class="conversation-header">
                <span>${escapeHTML(conversation.title)}</span>
                <span class="badge">
                    ${escapeHTML(conversation.style)}
                </span>
            </div>

            <div class="chat">

                ${conversation.lines.map(line => `
                    <div class="message">

                        <div class="speaker">
                            ${escapeHTML(line.speaker)}
                        </div>

                        <div class="bubble">
                            ${escapeHTML(line.text)}
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
                    onclick="screenshotConversation(${conversation.id})"
                >
                    📸 SCREENSHOT
                </button>

            </div>

        </article>
    `;
}

function renderExcuse(excuse) {

    return `
        <article class="excuse-card">

            <div class="result-label">
                YOUR EXCUSE
            </div>

            <h3>
                ${escapeHTML(excuse.answer)}
            </h3>

            <div class="conversation-actions">

                <button
                    onclick="copyText('${escapeHTML(excuse.answer)}')"
                >
                    COPY
                </button>

            </div>

        </article>
    `;
}

function generate() {

    const question = questionInput.value.trim();

    if (!question) {
        questionInput.focus();
        return;
    }

    const style = styleInput.value;
    const amount = Number(amountInput.value);

    currentBatch = [];

    const excuse = makeExcuse(question, style);

    let html = renderExcuse(excuse);

    html += `
        <div class="section-heading">
            RELATED CONVERSATIONS
        </div>
    `;

    for (let i = 0; i < amount; i++) {

        const conversation = getUnusedConversation();

        currentBatch.push(conversation);

        html += renderConversation(conversation);
    }

    html += `
        <button
            id="shareAll"
            class="share-all"
        >
            📸 MAKE SCREENSHOT OF ALL
        </button>
    `;

    result.innerHTML = html;

    document
        .getElementById("shareAll")
        .addEventListener("click", () => {
            screenshotAll(currentBatch);
        });

    result.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function copyText(text) {

    navigator.clipboard
        .writeText(text)
        .then(() => {
            alert("Copied.");
        })
        .catch(() => {
            alert("Copy failed.");
        });
}

function findConversation(id) {

    return data.conversations.find(
        conversation => conversation.id === id
    );
}

function conversationText(conversation) {

    return conversation.lines
        .map(line => `${line.speaker}: ${line.text}`)
        .join("\n\n");
}

function copyConversation(id) {

    const conversation = findConversation(id);

    if (!conversation) {
        return;
    }

    copyText(conversationText(conversation));
}

function drawConversation(ctx, conversation, x, y, width) {

    const padding = 35;
    const lineHeight = 28;

    ctx.fillStyle = "#151515";

    ctx.roundRect(
        x,
        y,
        width,
        60 + conversation.lines.length * 100,
        20
    );

    ctx.fill();

    ctx.fillStyle = "#ffffff";

    ctx.font = "bold 25px Arial";

    ctx.fillText(
        conversation.title,
        x + padding,
        y + 40
    );

    let cursorY = y + 90;

    conversation.lines.forEach(line => {

        ctx.font = "bold 20px Arial";

        ctx.fillStyle = "#999999";

        ctx.fillText(
            line.speaker,
            x + padding,
            cursorY
        );

        cursorY += 30;

        ctx.font = "20px Arial";

        ctx.fillStyle = "#ffffff";

        const words = line.text.split(" ");
        let current = "";

        for (const word of words) {

            const test = current
                ? current + " " + word
                : word;

            if (
                ctx.measureText(test).width >
                width - padding * 2
            ) {

                ctx.fillText(
                    current,
                    x + padding,
                    cursorY
                );

                cursorY += lineHeight;

                current = word;

            } else {

                current = test;

            }
        }

        if (current) {

            ctx.fillText(
                current,
                x + padding,
                cursorY
            );

            cursorY += lineHeight;
        }

        cursorY += 30;
    });
}

function createCanvas(conversations) {

    const width = 1200;
    const cardHeight = 430;
    const header = 180;

    const height =
        header +
        conversations.length * cardHeight +
        100;

    const canvas =
        document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#090909";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#ffffff";

    ctx.textAlign = "center";

    ctx.font = "bold 42px Arial";

    ctx.fillText(
        "☠️ EXCUSE-AS-A-SERVICE",
        width / 2,
        65
    );

    ctx.font = "22px Arial";

    ctx.fillStyle = "#999999";

    ctx.fillText(
        "ASK ANYTHING. GET AN EXCUSE.",
        width / 2,
        105
    );

    ctx.textAlign = "left";

    conversations.forEach((conversation, index) => {

        drawConversation(
            ctx,
            conversation,
            50,
            header + index * cardHeight,
            width - 100
        );
    });

    ctx.fillStyle = "#666666";

    ctx.font = "18px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "excuse-as-a-service",
        width / 2,
        height - 35
    );

    return canvas;
}

function downloadCanvas(canvas) {

    const link = document.createElement("a");

    link.download =
        "excuse-as-a-service.png";

    link.href =
        canvas.toDataURL("image/png");

    link.click();
}

async function shareCanvas(canvas) {

    const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/png")
    );

    if (!blob) {
        downloadCanvas(canvas);
        return;
    }

    const file = new File(
        [blob],
        "excuse-as-a-service.png",
        {
            type: "image/png"
        }
    );

    if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
    ) {

        await navigator.share({
            title: "Excuse-as-a-Service",
            text: "Absolutely necessary explanation.",
            files: [file]
        });

    } else {

        downloadCanvas(canvas);
    }
}

function screenshotConversation(id) {

    const conversation =
        findConversation(id);

    if (!conversation) {
        return;
    }

    const canvas =
        createCanvas([conversation]);

    shareCanvas(canvas);
}

function screenshotAll(conversations) {

    if (!conversations.length) {
        return;
    }

    const canvas =
        createCanvas(conversations);

    shareCanvas(canvas);
}

generateButton.addEventListener(
    "click",
    generate
);

questionInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            (event.ctrlKey || event.metaKey)
        ) {
            generate();
        }

    }
);
