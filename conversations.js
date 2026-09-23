/* =========================================================
   EXCUSE-AS-A-SERVICE
   RANDOM MULTIPLE CONVERSATIONS
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

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


/* =========================================================
   DATA
========================================================= */

const DATA =
    window.EXCUSE_DATA || {};

const conversations =
    Array.isArray(DATA.conversations)
        ? DATA.conversations
        : [];


if (conversations.length === 0) {

    container.innerHTML = `
        <article class="conversation-card">

            <div class="result-label">
                ERROR
            </div>

            <h3>
                No conversation data found.
            </h3>

            <p style="color:#777;">
                Check data/content.js.
            </p>

        </article>
    `;

    throw new Error(
        "EXCUSE_DATA.conversations is empty."
    );
}


/* =========================================================
   USED INDEXES
========================================================= */

const usedIndexes =
    new Set();


/* =========================================================
   RANDOM CONVERSATION
========================================================= */

function getRandomConversation() {

    /*
        Start a new pool after everything
        has been used.
    */

    if (
        usedIndexes.size >=
        conversations.length
    ) {

        usedIndexes.clear();
    }


    let index;

    do {

        index =
            Math.floor(
                Math.random() *
                conversations.length
            );

    } while (
        usedIndexes.has(index)
    );


    usedIndexes.add(index);


    return conversations[index];
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   CONVERT DIFFERENT DATA FORMATS
   INTO ONE STANDARD FORMAT
========================================================= */

function normalizeConversation(item) {

    /*
        RESULT:

        {
            title: "...",
            style: "...",
            messages: [
                {
                    speaker: "...",
                    text: "..."
                }
            ]
        }
    */


    /* -----------------------------------------------------
       TITLE
    ----------------------------------------------------- */

    const title =
        item.title ||
        item.name ||
        item.situation ||
        item.topic ||
        "Random Conversation";


    /* -----------------------------------------------------
       STYLE
    ----------------------------------------------------- */

    const style =
        item.style ||
        item.type ||
        "random";


    let messages = [];


    /* =====================================================
       FORMAT 1
       messages: [...]
    ===================================================== */

    if (
        Array.isArray(
            item.messages
        )
    ) {

        messages =
            item.messages.map(
                message => {

                    if (
                        typeof message ===
                        "string"
                    ) {

                        return {
                            speaker: "Someone",
                            text: message
                        };
                    }


                    return {

                        speaker:
                            message.speaker ||
                            message.character ||
                            message.role ||
                            "Someone",

                        text:
                            message.text ||
                            message.message ||
                            message.content ||
                            ""
                    };
                }
            );
    }


    /* =====================================================
       FORMAT 2
       lines: [...]
       
       THIS IS LIKELY YOUR FORMAT.
    ===================================================== */

    else if (
        Array.isArray(
            item.lines
        )
    ) {

        messages =
            item.lines.map(
                line => {

                    /*
                        If line is already:

                        {
                            speaker: "...",
                            text: "..."
                        }
                    */

                    if (
                        typeof line ===
                        "object"
                    ) {

                        return {

                            speaker:
                                line.speaker ||
                                line.character ||
                                line.role ||
                                "Someone",

                            text:
                                line.text ||
                                line.message ||
                                line.content ||
                                ""
                        };
                    }


                    /*
                        If line is:

                        "Boss: Where are you?"
                    */

                    const parsed =
                        parseDialogueLine(
                            line
                        );


                    return parsed;
                }
            );
    }


    /* =====================================================
       FORMAT 3
       dialogue: [...]
    ===================================================== */

    else if (
        Array.isArray(
            item.dialogue
        )
    ) {

        messages =
            item.dialogue.map(
                line => {

                    if (
                        typeof line ===
                        "object"
                    ) {

                        return {

                            speaker:
                                line.speaker ||
                                line.character ||
                                "Someone",

                            text:
                                line.text ||
                                line.message ||
                                ""
                        };
                    }


                    return parseDialogueLine(
                        line
                    );
                }
            );
    }


    /* =====================================================
       FORMAT 4
       conversation: [...]
    ===================================================== */

    else if (
        Array.isArray(
            item.conversation
        )
    ) {

        messages =
            item.conversation.map(
                line => {

                    if (
                        typeof line ===
                        "object"
                    ) {

                        return {

                            speaker:
                                line.speaker ||
                                line.character ||
                                "Someone",

                            text:
                                line.text ||
                                line.message ||
                                ""
                        };
                    }


                    return parseDialogueLine(
                        line
                    );
                }
            );
    }


    /* =====================================================
       FORMAT 5
       dialogue stored as text
    ===================================================== */

    else if (
        typeof item.dialogue ===
        "string"
    ) {

        messages =
            item.dialogue
                .split("\n")
                .filter(
                    line =>
                        line.trim()
                )
                .map(
                    line =>
                        parseDialogueLine(
                            line
                        )
                );
    }


    /* =====================================================
       FORMAT 6
       text stored as multiple lines
    ===================================================== */

    else if (
        typeof item.text ===
        "string"
    ) {

        messages =
            item.text
                .split("\n")
                .filter(
                    line =>
                        line.trim()
                )
                .map(
                    line =>
                        parseDialogueLine(
                            line
                        )
                );
    }


    /* =====================================================
       CLEAN EMPTY MESSAGES
    ===================================================== */

    messages =
        messages.filter(
            message =>
                message.text &&
                message.text.trim()
        );


    return {

        title,

        style,

        messages

    };
}


/* =========================================================
   PARSE:

   "Boss: Where were you?"
========================================================= */

function parseDialogueLine(line) {

    const text =
        String(
            line ?? ""
        ).trim();


    /*
        Find:

        Speaker: text
    */

    const match =
        text.match(
            /^([^:]{1,40}):\s*(.+)$/
        );


    if (match) {

        return {

            speaker:
                match[1].trim(),

            text:
                match[2].trim()

        };
    }


    /*
        If no speaker exists,
        alternate speakers.
    */

    return {

        speaker: "Someone",

        text

    };
}


/* =========================================================
   RENDER CONVERSATION
========================================================= */

function renderConversation(
    item,
    number
) {

    const data =
        normalizeConversation(
            item
        );


    const card =
        document.createElement(
            "article"
        );


    card.className =
        "conversation-card";


    let messagesHTML = "";


    /* -----------------------------------------------------
       ACTUAL DIALOGUE
    ----------------------------------------------------- */

    data.messages.forEach(
        message => {

            messagesHTML += `

                <div class="message">

                    <div class="speaker">
                        ${escapeHTML(
                            message.speaker
                        )}
                    </div>

                    <div class="bubble">
                        ${escapeHTML(
                            message.text
                        )}
                    </div>

                </div>

            `;
        }
    );


    /*
        Fallback only if absolutely no
        dialogue exists.
    */

    if (!messagesHTML) {

        messagesHTML = `

            <div class="message">

                <div class="speaker">
                    SYSTEM
                </div>

                <div class="bubble">
                    No dialogue text was found
                    in this conversation.
                </div>

            </div>

        `;
    }


    /* -----------------------------------------------------
       CARD
    ----------------------------------------------------- */

    card.innerHTML = `

        <div class="conversation-header">

            <span>
                CONVERSATION #${number}
            </span>

            <span class="badge">
                ${escapeHTML(
                    data.style
                )}
            </span>

        </div>


        <div class="result-label">

            ${escapeHTML(
                data.title
            )}

        </div>


        ${messagesHTML}


        <div class="conversation-actions">

            <button
                type="button"
                class="copy-button"
            >
                📋 COPY
            </button>

            <button
                type="button"
                class="screenshot-button"
            >
                📸 SCREENSHOT
            </button>

        </div>

    `;


    /* =====================================================
       COPY
    ===================================================== */

    const copyButton =
        card.querySelector(
            ".copy-button"
        );


    copyButton.addEventListener(
        "click",
        () => {

            copyConversation(
                data,
                copyButton
            );

        }
    );


    /* =====================================================
       SCREENSHOT
    ===================================================== */

    const screenshotButton =
        card.querySelector(
            ".screenshot-button"
        );


    screenshotButton.addEventListener(
        "click",
        () => {

            screenshotConversation(
                data,
                screenshotButton
            );

        }
    );


    return card;
}


/* =========================================================
   CONVERT TO TEXT
========================================================= */

function conversationToText(
    data
) {

    let output =
        "☠️ EXCUSE-AS-A-SERVICE\n\n";


    output +=
        data.title +
        "\n\n";


    data.messages.forEach(
        message => {

            output +=
                `${message.speaker}: `;

            output +=
                `${message.text}\n\n`;

        }
    );


    return output.trim();
}


/* =========================================================
   COPY
========================================================= */

async function copyConversation(
    data,
    button
) {

    const text =
        conversationToText(
            data
        );


    try {

        await navigator.clipboard.writeText(
            text
        );

    } catch {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.style.position =
            "fixed";


        textarea.style.left =
            "-9999px";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        document.execCommand(
            "copy"
        );


        textarea.remove();
    }


    button.textContent =
        "✓ COPIED";


    setTimeout(
        () => {

            button.textContent =
                "📋 COPY";

        },
        1500
    );
}


/* =========================================================
   GENERATE MULTIPLE
========================================================= */

function generateConversations() {

    const amount =
        parseInt(
            countSelect.value,
            10
        );


    if (
        !Number.isFinite(amount) ||
        amount < 1
    ) {

        return;
    }


    container.innerHTML =
        "";


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const item =
            getRandomConversation();


        const card =
            renderConversation(
                item,
                i + 1
            );


        container.appendChild(
            card
        );
    }


    resultHeading.textContent =
        `${amount} RANDOM CONVERSATION${
            amount === 1
                ? ""
                : "S"
        }`;
}


/* =========================================================
   SELECT CHANGE
========================================================= */

countSelect.addEventListener(
    "change",
    generateConversations
);


/* =========================================================
   GENERATE BUTTON
========================================================= */

generateButton.addEventListener(
    "click",
    generateConversations
);


/* =========================================================
   GENERATE MORE
========================================================= */

generateMoreButton.addEventListener(
    "click",
    generateConversations
);


/* =========================================================
   INITIAL
========================================================= */

generateConversations();
