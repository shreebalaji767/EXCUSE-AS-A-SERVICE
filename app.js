/* =========================================================
   EXCUSE-AS-A-SERVICE
   MAIN APP
   Complete app.js
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       DATA
    ===================================================== */

    const DATA = window.EXCUSE_DATA || {};

    const conversations = Array.isArray(DATA.conversations)
        ? DATA.conversations
        : [];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const situationInput =
        document.getElementById("situation");

    const styleSelect =
        document.getElementById("style");

    const countSelect =
        document.getElementById("conversationCount");

    const generateButton =
        document.getElementById("generateButton");

    const resultsContainer =
        document.getElementById("results");

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

    function getRandomConversation(preferredStyle = "") {

        if (!conversations.length) {
            return null;
        }


        let available = conversations.filter(
            (_, index) => !usedIndexes.has(index)
        );


        /*
         * Prefer the selected style.
         */

        if (preferredStyle) {

            const styleMatches =
                available.filter(
                    conversation =>
                        String(
                            conversation.style || ""
                        ).toLowerCase() ===
                        preferredStyle.toLowerCase()
                );

            if (styleMatches.length) {
                available = styleMatches;
            }
        }


        /*
         * If the current pool is exhausted,
         * start a new runtime cycle.
         */

        if (!available.length) {

            usedIndexes.clear();

            available = [...conversations];

            if (preferredStyle) {

                const styleMatches =
                    available.filter(
                        conversation =>
                            String(
                                conversation.style || ""
                            ).toLowerCase() ===
                            preferredStyle.toLowerCase()
                    );

                if (styleMatches.length) {
                    available = styleMatches;
                }
            }
        }


        const selected =
            available[
                Math.floor(
                    Math.random() *
                    available.length
                )
            ];


        const realIndex =
            conversations.indexOf(selected);


        if (realIndex !== -1) {
            usedIndexes.add(realIndex);
        }


        return selected;
    }


    /* =====================================================
       SPEAKERS
    ===================================================== */

    function getSpeakers(messages) {

        const speakers = [];

        messages.forEach(message => {

            const name =
                String(
                    message.speaker ||
                    "Unknown"
                ).trim();

            if (!speakers.includes(name)) {
                speakers.push(name);
            }
        });

        return speakers;
    }


    /* =====================================================
       MESSAGE SIDE
    ===================================================== */

    function getSide(
        message,
        speakers,
        speakerMap
    ) {

        /*
         * If generator provides speakerId,
         * use it.
         */

        if (
            message.speakerId !== undefined &&
            message.speakerId !== null
        ) {

            return Number(
                message.speakerId
            ) === 0
                ? "incoming"
                : "outgoing";
        }


        const speaker =
            String(
                message.speaker ||
                "Unknown"
            ).trim();


        /*
         * Two-speaker conversation.
         */

        if (speakers.length >= 2) {

            if (
                speaker === speakers[0]
            ) {
                return "incoming";
            }

            if (
                speaker === speakers[1]
            ) {
                return "outgoing";
            }
        }


        /*
         * Fallback for conversations
         * containing more speakers.
         */

        if (!speakerMap.has(speaker)) {

            speakerMap.set(
                speaker,
                speakerMap.size % 2 === 0
                    ? "incoming"
                    : "outgoing"
            );
        }


        return speakerMap.get(
            speaker
        );
    }


    /* =====================================================
       TIME
    ===================================================== */

    function getTime(index) {

        const totalMinutes =
            9 * 60 +
            index * 7;


        const hour24 =
            Math.floor(
                totalMinutes / 60
            ) % 24;


        const minute =
            totalMinutes % 60;


        const hour12 =
            hour24 % 12 || 12;


        const suffix =
            hour24 >= 12
                ? "PM"
                : "AM";


        return (
            `${hour12}:` +
            `${String(minute).padStart(2, "0")} ` +
            suffix
        );
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


            showTemporaryMessage(
                "COPIED"
            );

        } catch {

            const textarea =
                document.createElement(
                    "textarea"
                );

            textarea.value = text;

            document.body.appendChild(
                textarea
            );

            textarea.select();

            document.execCommand(
                "copy"
            );

            textarea.remove();


            showTemporaryMessage(
                "COPIED"
            );
        }
    }


    /* =====================================================
       SCREENSHOT
    ===================================================== */

    async function screenshotConversation(
        card,
        number
    ) {

        if (
            typeof html2canvas ===
            "undefined"
        ) {

            alert(
                "Screenshot support is not available."
            );

            return;
        }


        try {

            const canvas =
                await html2canvas(
                    card,
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
                document.createElement(
                    "a"
                );


            link.download =
                `excuse-${number}.png`;


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            link.click();

        } catch (error) {

            console.error(
                "Screenshot error:",
                error
            );

            alert(
                "Could not create screenshot."
            );
        }
    }


    /* =====================================================
       TEMPORARY MESSAGE
    ===================================================== */

    function showTemporaryMessage(
        message
    ) {

        const notice =
            document.createElement(
                "div"
            );


        notice.textContent =
            message;


        notice.style.position =
            "fixed";

        notice.style.left =
            "50%";

        notice.style.bottom =
            "25px";

        notice.style.transform =
            "translateX(-50%)";

        notice.style.zIndex =
            "99999";

        notice.style.padding =
            "11px 18px";

        notice.style.background =
            "#ffffff";

        notice.style.color =
            "#000000";

        notice.style.borderRadius =
            "999px";

        notice.style.fontSize =
            "12px";

        notice.style.fontWeight =
            "900";

        notice.style.boxShadow =
            "0 10px 35px rgba(0,0,0,.5)";


        document.body.appendChild(
            notice
        );


        setTimeout(() => {

            notice.remove();

        }, 1400);
    }


    /* =====================================================
       CREATE CONVERSATION CARD
    ===================================================== */

    function createConversationCard(
        conversation,
        number
    ) {

        const messages =
            Array.isArray(
                conversation.messages
            )
                ? conversation.messages
                : [];


        const speakers =
            getSpeakers(messages);


        const speakerMap =
            new Map();


        const firstSpeaker =
            speakers[0] ||
            "Unknown";


        const secondSpeaker =
            speakers[1] ||
            "Chat";


        const title =
            conversation.title ||
            `${firstSpeaker} & ${secondSpeaker}`;


        const style =
            conversation.style ||
            "believable";


        /* ================================================
           CARD
        ================================================= */

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "conversation-card";


        /* ================================================
           HEADER
        ================================================= */

        const header =
            document.createElement(
                "div"
            );


        header.className =
            "conversation-header";


        const avatar =
            document.createElement(
                "div"
            );


        avatar.className =
            "conversation-avatar";


        const headerInfo =
            document.createElement(
                "div"
            );


        const heading =
            document.createElement(
                "h2"
            );


        heading.textContent =
            title;


        const small =
            document.createElement(
                "small"
            );


        small.textContent =
            `${style} · #${number}`;


        headerInfo.appendChild(
            heading
        );


        header.appendChild(
            avatar
        );


        header.appendChild(
            headerInfo
        );


        header.appendChild(
            small
        );


        /* ================================================
           CHAT
        ================================================= */

        const dialogue =
            document.createElement(
                "div"
            );


        dialogue.className =
            "conversation-dialogue";


        messages.forEach(
            (message, index) => {

                const text =
                    String(
                        message.text ||
                        ""
                    ).trim();


                if (!text) {
                    return;
                }


                const speaker =
                    String(
                        message.speaker ||
                        "Unknown"
                    ).trim();


                const side =
                    getSide(
                        message,
                        speakers,
                        speakerMap
                    );


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    `conversation-message ${side}`;


                const content =
                    document.createElement(
                        "div"
                    );


                content.className =
                    "message-content";


                const speakerElement =
                    document.createElement(
                        "div"
                    );


                speakerElement.className =
                    "message-speaker";


                speakerElement.textContent =
                    speaker;


                const bubble =
                    document.createElement(
                        "div"
                    );


                bubble.className =
                    "message-text";


                bubble.setAttribute(
                    "data-time",
                    getTime(index)
                );


                bubble.appendChild(
                    document.createTextNode(
                        text
                    )
                );


                if (
                    side ===
                    "outgoing"
                ) {

                    const check =
                        document.createElement(
                            "span"
                        );


                    check.className =
                        "message-check";


                    check.textContent =
                        " ✓✓";


                    bubble.appendChild(
                        check
                    );
                }


                content.appendChild(
                    speakerElement
                );


                content.appendChild(
                    bubble
                );


                row.appendChild(
                    content
                );


                dialogue.appendChild(
                    row
                );

            }
        );


        /* ================================================
           ACTIONS
        ================================================= */

        const actions =
            document.createElement(
                "div"
            );


        actions.className =
            "conversation-actions";


        const copyButton =
            document.createElement(
                "button"
            );


        copyButton.type =
            "button";


        copyButton.textContent =
            "COPY";


        copyButton.addEventListener(
            "click",
            () => {

                copyConversation(
                    conversation
                );

            }
        );


        const screenshotButton =
            document.createElement(
                "button"
            );


        screenshotButton.type =
            "button";


        screenshotButton.textContent =
            "SCREENSHOT";


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


        /* ================================================
           META
        ================================================= */

        const meta =
            document.createElement(
                "div"
            );


        meta.className =
            "conversation-meta";


        const leftMeta =
            document.createElement(
                "span"
            );


        leftMeta.textContent =
            `${messages.length} messages`;


        const rightMeta =
            document.createElement(
                "span"
            );


        rightMeta.textContent =
            "NO DATABASE";


        meta.appendChild(
            leftMeta
        );


        meta.appendChild(
            rightMeta
        );


        /* ================================================
           BUILD
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
       GENERATE
    ===================================================== */

    function generate() {

        if (!resultsContainer) {
            return;
        }


        let amount =
            Number(
                countSelect?.value || 5
            );


        if (
            !Number.isFinite(amount)
        ) {
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


        const selectedStyle =
            String(
                styleSelect?.value || ""
            ).trim();


        /*
         * Clear old results.
         */

        resultsContainer.innerHTML =
            "";


        /*
         * Heading.
         */

        if (resultHeading) {

            resultHeading.textContent =
                `${amount} GENERATED CONVERSATION${
                    amount === 1
                        ? ""
                        : "S"
                }`;
        }


        /*
         * No generated data.
         */

        if (!conversations.length) {

            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <h2>NO CONTENT FOUND</h2>
                    <p>
                        Run:
                        python build/generate.py
                    </p>
                </div>
            `;

            return;
        }


        /*
         * Generate requested number.
         */

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const conversation =
                getRandomConversation(
                    selectedStyle
                );


            if (!conversation) {
                continue;
            }


            const card =
                createConversationCard(
                    conversation,
                    i + 1
                );


            resultsContainer.appendChild(
                card
            );
        }


        /*
         * Scroll to results.
         */

        setTimeout(() => {

            if (
                resultsContainer.children.length
            ) {

                resultsContainer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }, 50);
    }


    /* =====================================================
       GENERATE BUTTON
    ===================================================== */

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            generate
        );
    }


    /* =====================================================
       CTRL + ENTER
    ===================================================== */

    if (situationInput) {

        situationInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.ctrlKey &&
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    generate();
                }

            }
        );
    }


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            /*
             * Do not automatically generate
             * on page load.
             *
             * User clicks GENERATE.
             */

            if (resultHeading) {

                resultHeading.textContent =
                    "READY TO GENERATE";
            }

        }
    );

})();
