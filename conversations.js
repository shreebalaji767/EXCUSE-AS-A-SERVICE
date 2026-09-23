/* =========================================================
   EXCUSE-AS-A-SERVICE
   MULTIPLE CONVERSATIONS
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
   LOAD DATA
========================================================= */

const DATA =
    window.EXCUSE_DATA || {};

const conversations =
    Array.isArray(DATA.conversations)
        ? DATA.conversations
        : [];


if (!conversations.length) {

    container.innerHTML = `
        <div class="conversation-card">

            <div class="result-label">
                ERROR
            </div>

            <h3>
                No conversations were found.
            </h3>

            <p style="color:#777;">
                Check data/content.js and make sure
                it contains EXCUSE_DATA.conversations.
            </p>

        </div>
    `;

    throw new Error(
        "No conversations found in EXCUSE_DATA."
    );
}


/* =========================================================
   USED CONVERSATIONS
========================================================= */

const usedIndexes = new Set();


/* =========================================================
   GET UNIQUE RANDOM CONVERSATION
========================================================= */

function getRandomConversation() {

    /*
        If there are still unused conversations,
        choose only from unused ones.
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
   NORMALIZE DATA
========================================================= */

function normalizeConversation(item) {

    /*
        Format 1:

        {
            title: "...",
            style: "...",
            messages: [...]
        }

        Format 2:

        {
            situation: "...",
            style: "...",
            dialogue: [...]
        }

        Format 3:

        {
            conversation: [...]
        }
    */


    let messages = [];


    if (
        Array.isArray(
            item.messages
        )
    ) {

        messages =
            item.messages;

    } else if (
        Array.isArray(
            item.dialogue
        )
    ) {

        messages =
            item.dialogue;

    } else if (
        Array.isArray(
            item.conversation
        )
    ) {

        messages =
            item.conversation;
    }


    /*
        Normalize every message.
    */

    messages =
        messages.map(
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


    return {

        title:
            item.title ||
            item.situation ||
            "Random Conversation",

        style:
            item.style ||
            "random",

        messages
    };
}


/* =========================================================
   PLAIN TEXT
========================================================= */

function conversationToText(data) {

    let text =
        "☠️ EXCUSE-AS-A-SERVICE\n\n";


    if (data.title) {

        text +=
            data.title +
            "\n\n";
    }


    data.messages.forEach(
        message => {

            text +=
                `${message.speaker}: `;

            text +=
                `${message.text}\n\n`;
        }
    );


    return text.trim();
}


/* =========================================================
   COPY
========================================================= */

async function copyConversation(
    data,
    button
) {

    const text =
        conversationToText(data);


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
        If no messages exist,
        still show the conversation.
    */

    if (!messagesHTML) {

        messagesHTML = `

            <div class="message">

                <div class="speaker">
                    RANDOM
                </div>

                <div class="bubble">
                    ${escapeHTML(
                        data.title
                    )}
                </div>

            </div>

        `;
    }


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


    /*
        COPY
    */

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


    /*
        SCREENSHOT
    */

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
   GENERATE
========================================================= */

function generateConversations() {

    /*
        IMPORTANT:
        Read the SELECTED VALUE every time.
    */

    const amount =
        parseInt(
            countSelect.value,
            10
        );


    if (
        !amount ||
        amount < 1
    ) {

        return;
    }


    /*
        Clear old conversations.
    */

    container.innerHTML = "";


    /*
        Make EXACTLY the selected amount,
        provided the dataset contains enough
        unique conversations.
    */

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const conversation =
            getRandomConversation();


        const card =
            renderConversation(
                conversation,
                i + 1
            );


        container.appendChild(
            card
        );
    }


    /*
        Update heading.
    */

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

/*
    THIS is the important part.

    When the user changes:

    1 → immediately generate 1
    3 → immediately generate 3
    5 → immediately generate 5
    10 → immediately generate 10
    20 → immediately generate 20
    50 → immediately generate 50
*/

countSelect.addEventListener(
    "change",
    generateConversations
);


/* =========================================================
   BUTTON
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
   INITIAL LOAD
========================================================= */

generateConversations();
