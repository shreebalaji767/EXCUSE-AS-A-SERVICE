(() => {

    "use strict";


    const DATA =
        window.EXCUSE_DATA || {};


    const conversations =
        Array.isArray(DATA.conversations)
            ? DATA.conversations
            : [];


    const situation =
        document.getElementById("situation");


    const styleInput =
        document.getElementById("style");


    const countSelect =
        document.getElementById("conversationCount");


    const countValue =
        document.getElementById("countValue");


    const countDisplay =
        document.getElementById("countDisplay");


    const minus =
        document.getElementById("countMinus");


    const plus =
        document.getElementById("countPlus");


    const generateButton =
        document.getElementById("generateButton");


    const results =
        document.getElementById("results");


    const emptyState =
        document.getElementById("emptyState");


    const heading =
        document.getElementById("resultHeading");


    const resultCount =
        document.getElementById("resultCount");


    const styleButtons =
        [
            ...document.querySelectorAll(
                ".style-option"
            )
        ];


    const counts =
        [
            1,
            3,
            5,
            10,
            20,
            50
        ];


    let used =
        new Set();


    /* ESCAPE */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(
                /[&<>"']/g,
                character => {

                    const map = {

                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#039;"

                    };

                    return map[character];

                }
            );

    }


    /* COUNT */

    function setCount(value) {

        let number =
            Number(value);


        if (!counts.includes(number)) {

            number = 5;

        }


        countSelect.value =
            String(number);


        countValue.textContent =
            number;


        countDisplay.textContent =
            number;

    }


    /* STYLE */

    function selectedStyle() {

        return styleInput?.value ||
            "believable";

    }


    /* RANDOM */

    function randomIndex(pool) {

        if (!pool.length) {

            return -1;

        }


        if (
            used.size >=
            conversations.length
        ) {

            used.clear();

        }


        let index;


        do {

            index =
                Math.floor(
                    Math.random() *
                    pool.length
                );

        }

        while (
            used.has(
                pool[index]
            )
        );


        used.add(
            pool[index]
        );


        return pool[index];

    }


    /* PICK */

    function pickConversation(style) {

        const styled =
            conversations
                .map(
                    (conversation, index) => ({
                        conversation,
                        index
                    })
                )
                .filter(
                    item =>
                        String(
                            item.conversation.style ||
                            ""
                        ).toLowerCase() ===
                        style
                );


        const pool =
            styled.length
                ? styled.map(
                    item => item.index
                )
                : conversations.map(
                    (_, index) => index
                );


        const index =
            randomIndex(pool);


        if (index < 0) {

            return null;

        }


        return conversations[index];

    }


    /* TIME */

    function getTime(index) {

        const total =
            9 * 60 +
            7 +
            index * 7;


        const hour24 =
            Math.floor(
                total / 60
            ) % 24;


        const minutes =
            total % 60;


        const hour12 =
            ((hour24 + 11) % 12) + 1;


        const suffix =
            hour24 >= 12
                ? "PM"
                : "AM";


        return (
            hour12 +
            ":" +
            String(minutes)
                .padStart(2, "0") +
            " " +
            suffix
        );

    }


    /* SIDES */

    function getSides(messages) {

        const speakerIds =
            new Map();


        let nextId = 0;


        return messages.map(
            message => {

                if (
                    message.speakerId !==
                    undefined
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
                    );


                if (
                    !speakerIds.has(
                        speaker
                    )
                ) {

                    speakerIds.set(
                        speaker,
                        nextId++
                    );

                }


                return (
                    speakerIds.get(
                        speaker
                    ) % 2 === 0
                )
                    ? "incoming"
                    : "outgoing";

            }
        );

    }


    /* CARD */

    function createConversationCard(
        conversation,
        index
    ) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "conversation-card";


        const messages =
            Array.isArray(
                conversation.messages
            )
                ? conversation.messages
                : [];


        const speakers =
            [
                ...new Set(
                    messages.map(
                        message =>
                            String(
                                message.speaker ||
                                "Unknown"
                            )
                    )
                )
            ];


        const title =
            conversation.title ||
            speakers
                .slice(0, 2)
                .join(" & ") ||
            "Conversation";


        /* HEADER */

        const header =
            document.createElement(
                "div"
            );


        header.className =
            "conversation-header";


        header.innerHTML = `

            <div class="conversation-avatar">
                👤
            </div>

            <div class="conversation-info">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ● ONLINE
                </p>

            </div>

            <span class="conversation-style">
                ${escapeHTML(
                    conversation.style ||
                    "casual"
                )}
            </span>

        `;


        /* CHAT */

        const dialogue =
            document.createElement(
                "div"
            );


        dialogue.className =
            "conversation-dialogue";


        const sides =
            getSides(messages);


        messages.forEach(
            (message, messageIndex) => {

                const text =
                    String(
                        message.text ||
                        ""
                    ).trim();


                if (!text) {
                    return;
                }


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "conversation-message " +
                    sides[messageIndex];


                const content =
                    document.createElement(
                        "div"
                    );


                content.className =
                    "message-content";


                const speaker =
                    document.createElement(
                        "div"
                    );


                speaker.className =
                    "message-speaker";


                speaker.textContent =
                    message.speaker ||
                    "Unknown";


                const bubble =
                    document.createElement(
                        "div"
                    );


                bubble.className =
                    "message-text";


                bubble.setAttribute(
                    "data-time",
                    getTime(
                        messageIndex
                    )
                );


                bubble.textContent =
                    text;


                if (
                    sides[messageIndex] ===
                    "outgoing"
                ) {

                    const check =
                        document.createElement(
                            "span"
                        );


                    check.className =
                        "message-check";


                    check.textContent =
                        "✓✓";


                    bubble.appendChild(
                        check
                    );

                }


                content.append(
                    speaker,
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


        /* ACTIONS */

        const actions =
            document.createElement(
                "div"
            );


        actions.className =
            "conversation-actions";


        const fakeInput =
            document.createElement(
                "div"
            );


        fakeInput.className =
            "fake-input";


        fakeInput.textContent =
            "Message...";


        const copyButton =
            document.createElement(
                "button"
            );


        copyButton.type =
            "button";


        copyButton.className =
            "action-button";


        copyButton.textContent =
            "COPY";


        const screenshotButton =
            document.createElement(
                "button"
            );


        screenshotButton.type =
            "button";


        screenshotButton.className =
            "action-button";


        screenshotButton.textContent =
            "SCREENSHOT";


        copyButton.addEventListener(
            "click",
            () => {

                copyConversation(
                    conversation,
                    copyButton
                );

            }
        );


        screenshotButton.addEventListener(
            "click",
            () => {

                screenshotConversation(
                    article,
                    index
                );

            }
        );


        actions.append(
            fakeInput,
            copyButton,
            screenshotButton
        );


        /* META */

        const meta =
            document.createElement(
                "div"
            );


        meta.className =
            "conversation-meta";


        meta.innerHTML = `

            <span>
                ${messages.length} messages
            </span>

            <span>
                ENCRYPTED WITH ABSOLUTELY NOTHING
            </span>

        `;


        article.append(
            header,
            dialogue,
            actions,
            meta
        );


        return article;

    }


    /* COPY */

    async function copyConversation(
        conversation,
        button
    ) {

        const text =
            (conversation.messages || [])
                .map(
                    message =>
                        message.speaker +
                        ": " +
                        message.text
                )
                .join("\n");


        try {

            await navigator.clipboard
                .writeText(text);

        }

        catch {

            const textarea =
                document.createElement(
                    "textarea"
                );


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


        const oldText =
            button.textContent;


        button.textContent =
            "COPIED";


        setTimeout(
            () => {

                button.textContent =
                    oldText;

            },
            1000
        );

    }


    /* SCREENSHOT */

    async function screenshotConversation(
        element,
        index
    ) {

        if (
            typeof html2canvas ===
            "undefined"
        ) {

            alert(
                "Screenshot engine is unavailable."
            );

            return;

        }


        try {

            const canvas =
                await html2canvas(
                    element,
                    {

                        backgroundColor:
                            "#0b0b0b",

                        scale:
                            Math.min(
                                window.devicePixelRatio ||
                                1,
                                2
                            ),

                        useCORS: true

                    }
                );


            const link =
                document.createElement(
                    "a"
                );


            link.download =
                "excuse-conversation-" +
                index +
                ".png";


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            link.click();

        }

        catch (error) {

            console.error(
                error
            );


            alert(
                "Could not create screenshot."
            );

        }

    }


    /* GENERATE */

    function generate() {

        const situationText =
            situation?.value.trim() ||
            "something went wrong";


        const style =
            selectedStyle();


        const amount =
            Number(
                countSelect?.value
            ) || 5;


        results.innerHTML =
            "";


        if (emptyState) {

            emptyState.style.display =
                "none";

        }


        heading.textContent =
            amount +
            " GENERATED EXCUSE" +
            (
                amount === 1
                    ? ""
                    : "S"
            );


        resultCount.textContent =
            amount;


        if (!conversations.length) {

            results.innerHTML = `

                <div class="empty-state">

                    <div>
                        ⚠️
                    </div>

                    <h3>
                        No content found.
                    </h3>

                    <p>
                        Run
                        python build/generate.py
                        and reload the site.
                    </p>

                </div>

            `;

            return;

        }


        generateButton.disabled =
            true;


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const conversation =
                pickConversation(
                    style
                );


            if (!conversation) {
                break;
            }


            const copy =
                JSON.parse(
                    JSON.stringify(
                        conversation
                    )
                );


            /*
             * Put the user's situation
             * into the first question.
             */

            if (
                situationText &&
                copy.messages &&
                copy.messages.length
            ) {

                copy.messages[0].text =
                    situationText
                        .replace(
                            /[.!?]+$/,
                            ""
                        ) +
                    "?";

            }


            results.appendChild(
                createConversationCard(
                    copy,
                    i + 1
                )
            );

        }


        generateButton.disabled =
            false;


        setTimeout(
            () => {

                results.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            },
            80
        );

    }


    /* STYLE BUTTONS */

    styleButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    styleButtons.forEach(
                        item =>
                            item.classList.remove(
                                "selected"
                            )
                    );


                    button.classList.add(
                        "selected"
                    );


                    styleInput.value =
                        button.dataset.style;

                }
            );

        }
    );


    /* COUNT - */

    minus?.addEventListener(
        "click",
        () => {

            const index =
                counts.indexOf(
                    Number(
                        countSelect.value
                    )
                );


            setCount(
                counts[
                    Math.max(
                        0,
                        index - 1
                    )
                ]
            );

        }
    );


    /* COUNT + */

    plus?.addEventListener(
        "click",
        () => {

            const index =
                counts.indexOf(
                    Number(
                        countSelect.value
                    )
                );


            setCount(
                counts[
                    Math.min(
                        counts.length - 1,
                        index + 1
                    )
                ]
            );

        }
    );


    /* GENERATE */

    generateButton?.addEventListener(
        "click",
        generate
    );


    /* CTRL + ENTER */

    situation?.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key === "Enter"
            ) {

                event.preventDefault();

                generate();

            }

        }
    );


    setCount(5);

})();
