/* =========================================================
   EXCUSE-AS-A-SERVICE
   SMS CONVERSATIONS
   COMPLETE conversations.js
========================================================= */

(() => {
    "use strict";

    const DATA = window.EXCUSE_DATA || {};
    const conversations = Array.isArray(DATA.conversations)
        ? DATA.conversations
        : [];

    const countSelect =
        document.getElementById("conversationCount");

    const generateButton =
        document.getElementById("generateConversations");

    const generateMoreButton =
        document.getElementById("generateMore");

    const container =
        document.getElementById("conversationContainer");

    const resultHeading =
        document.getElementById("resultHeading");


    /* =====================================================
       STATE
    ===================================================== */

    const usedIndexes = new Set();


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       RANDOM CONVERSATION
    ===================================================== */

    function getRandomConversation() {

        if (!conversations.length) {
            return null;
        }

        /*
         * If every conversation has already been shown,
         * start a new runtime cycle.
         *
         * No database.
         * No localStorage.
         * No permanent storage.
         */
        if (usedIndexes.size >= conversations.length) {
            usedIndexes.clear();
        }

        let index;

        do {
            index = Math.floor(
                Math.random() * conversations.length
            );
        } while (usedIndexes.has(index));

        usedIndexes.add(index);

        return conversations[index];
    }


    /* =====================================================
       GET SPEAKER INFORMATION
    ===================================================== */

    function getSpeakerInfo(messages) {

        const speakers = [];

        messages.forEach((message) => {

            const speaker =
                String(
                    message.speaker || "Unknown"
                ).trim();

            if (!speakers.includes(speaker)) {
                speakers.push(speaker);
            }
        });

        return speakers;
    }


    /* =====================================================
       MESSAGE SIDE
    ===================================================== */

    function getMessageSide(
        message,
        speakers,
        speakerMap
    ) {

        /*
         * Preferred method:
         *
         * speakerId: 0
         * speakerId: 1
         */

        if (
            message.speakerId !== undefined &&
            message.speakerId !== null
        ) {

            return Number(message.speakerId) === 0
                ? "incoming"
                : "outgoing";
        }


        /*
         * If there are two different speakers,
         * first speaker = left
         * second speaker = right
         */

        const speaker =
            String(
                message.speaker || "Unknown"
            ).trim();

        if (speakers.length >= 2) {

            if (speaker === speakers[0]) {
                return "incoming";
            }

            if (speaker === speakers[1]) {
                return "outgoing";
            }
        }


        /*
         * Fallback mapping.
         */

        if (!speakerMap.has(speaker)) {

            const nextSide =
                speakerMap.size % 2 === 0
                    ? "incoming"
                    : "outgoing";

            speakerMap.set(
                speaker,
                nextSide
            );
        }

        return speakerMap.get(speaker);
    }


    /* =====================================================
       MESSAGE TIME
    ===================================================== */

    function generateTime(index) {

        const hour =
            9 + Math.floor(index / 3);

        const minute =
            (index * 7) % 60;

        const h =
            hour > 12
                ? hour - 12
                : hour;

        const suffix =
            hour >= 12
                ? "PM"
                : "AM";

        return `${h}:${String(minute).padStart(2, "0")} ${suffix}`;
    }


    /* =====================================================
       CONVERSATION CARD
    ===================================================== */

    function createConversationCard(
        conversation,
        number
    ) {

        const card =
            document.createElement("article");

        card.className =
            "conversation-card";


        /* -------------------------------------------------
           DATA
        ------------------------------------------------- */

        const messages =
            Array.isArray(
                conversation.messages
            )
                ? conversation.messages
                : [];


        const speakers =
            getSpeakerInfo(messages);


        const speakerMap =
            new Map();


        const firstSpeaker =
            speakers[0] || "Unknown";


        const secondSpeaker =
            speakers[1] || "Chat";


        const title =
            conversation.title ||
            `${firstSpeaker} & ${secondSpeaker}`;


        const style =
            conversation.style ||
            "casual";


        /* =================================================
           HEADER
        ================================================= */

        const header =
            document.createElement("div");

        header.className =
            "conversation-header";


        const avatar =
            document.createElement("div");

        avatar.className =
            "conversation-avatar";


        const headerInfo =
            document.createElement("div");

        const heading =
            document.createElement("h2");

        heading.textContent =
            title;


        const small =
            document.createElement("small");

        small.textContent =
            `#${number} · ${style}`;


        headerInfo.appendChild(heading);

        header.appendChild(avatar);
        header.appendChild(headerInfo);
        header.appendChild(small);


        /* =================================================
           CHAT BODY
        ================================================= */

        const dialogue =
            document.createElement("div");

        dialogue.className =
            "conversation-dialogue";


        messages.forEach(
            (message, index) => {

                const speaker =
                    String(
                        message.speaker ||
                        "Unknown"
                    ).trim();


                const text =
                    String(
                        message.text ||
                        ""
                    ).trim();


                if (!text) {
                    return;
                }


                const side =
                    getMessageSide(
                        message,
                        speakers,
                        speakerMap
                    );


                const messageRow =
                    document.createElement("div");

                messageRow.className =
                    `conversation-message ${side}`;


                const content =
                    document.createElement("div");

                content.className =
                    "message-content";


                const speakerElement =
                    document.createElement("div");

                speakerElement.className =
                    "message-speaker";

                speakerElement.textContent =
                    speaker;


                const bubble =
                    document.createElement("div");

                bubble.className =
                    "message-text";

                bubble.textContent =
                    text;


                /*
                 * Put SMS timestamp into the
                 * CSS ::after content.
                 */

                bubble.setAttribute(
                    "data-time",
                    generateTime(index)
                );


                /*
                 * WhatsApp/SMS-like read status
                 * on outgoing messages.
                 */

                if (side === "outgoing") {

                    const check =
                        document.createElement("span");

                    check.className =
                        "message-check";

                    check.textContent =
                        "✓✓";

                    bubble.appendChild(check);
                }


                content.appendChild(
                    speakerElement
                );

                content.appendChild(
                    bubble
                );

                messageRow.appendChild(
                    content
                );

                dialogue.appendChild(
                    messageRow
                );
            }
        );


        /* =================================================
           SMS INPUT BAR
        ================================================= */

        const actions =
            document.createElement("div");

        actions.className =
            "conversation-actions";


        const copyButton =
            document.createElement("button");

        copyButton.type =
            "button";

        copyButton.textContent =
            "COPY";


        const screenshotButton =
            document.createElement("button");

        screenshotButton.type =
            "button";

        screenshotButton.textContent =
            "SCREENSHOT";


        copyButton.addEventListener(
            "click",
            () => {
                copyConversation(
                    conversation
                );
            }
        );


        screenshotButton.addEventListener(
            "click",
            () => {
                screenshotConversation(
                    card,
                    number
                );
            }
        );


        actions.appendChild(
            copyButton
        );

        actions.appendChild(
            screenshotButton
        );


        /* =================================================
           META
        ================================================= */

        const meta =
            document.createElement("div");

        meta.className =
            "conversation-meta";


        const metaLeft =
            document.createElement("span");

        metaLeft.textContent =
            `${messages.length} messages`;


        const metaRight =
            document.createElement("span");

        metaRight.textContent =
            "ENCRYPTED WITH ABSOLUTELY NOTHING";


        meta.appendChild(
            metaLeft
        );

        meta.appendChild(
            metaRight
        );


        /* =================================================
           BUILD CARD
        ================================================= */

        card.appendChild(
            header
        );

        card.appendChild(
            dialogue
        );

        card.appendChild(
            actions
        );

        card.appendChild(
            meta
        );


        return card;
    }


    /* =====================================================
       COPY
    ===================================================== */

    async function copyConversation(
        conversation
    ) {

        const messages =
            Array.isArray(
                conversation.messages
            )
                ? conversation.messages
                : [];


        const text =
            messages
                .map(
                    message =>
                        `${message.speaker}: ${message.text}`
                )
                .join("\n");


        try {

            await navigator.clipboard.writeText(
                text
            );

        } catch {

            const textarea =
                document.createElement("textarea");

            textarea.value =
                text;

            document.body.appendChild(
                textarea
            );

            textarea.select();

            document.execCommand(
                "copy"
            );

            textarea.remove();
        }
    }


    /* =====================================================
       SCREENSHOT
    ===================================================== */

    async function screenshotConversation(
        element,
        number
    ) {

        /*
         * Uses html2canvas if available.
         * If it isn't available, inform the user.
         */

        if (
            typeof html2canvas ===
            "undefined"
        ) {

            alert(
                "Screenshot engine is not loaded. Add html2canvas to enable screenshots."
            );

            return;
        }


        try {

            const canvas =
                await html2canvas(
                    element,
                    {
                        backgroundColor:
                            "#0c0c0c",

                        scale:
                            Math.min(
                                window.devicePixelRatio || 1,
                                2
                            ),

                        useCORS:
                            true
                    }
                );


            const link =
                document.createElement("a");


            link.download =
                `excuse-conversation-${number}.png`;


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            link.click();

        } catch (error) {

            console.error(
                "Screenshot failed:",
                error
            );

            alert(
                "Could not create screenshot."
            );
        }
    }


    /* =====================================================
       GENERATE
    ===================================================== */

    function generateConversations() {

        if (!container) {
            return;
        }


        let amount =
            Number(
                countSelect
                    ? countSelect.value
                    : 5
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


        container.innerHTML =
            "";


        if (
            resultHeading
        ) {

            resultHeading.textContent =
                `${amount} RANDOM CONVERSATION${
                    amount === 1
                        ? ""
                        : "S"
                }`;
        }


        if (!conversations.length) {

            container.innerHTML = `
                <div class="empty-state">
                    <h2>NO CONVERSATIONS FOUND</h2>
                    <p>
                        Run build/generate.py first.
                    </p>
                </div>
            `;

            return;
        }


        for (
            let i = 0;
            i < amount;
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
                    i + 1
                );


            container.appendChild(
                card
            );
        }
    }


    /* =====================================================
       EVENTS
    ===================================================== */

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


    /* =====================================================
       START
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            generateConversations();

        }
    );

})();
