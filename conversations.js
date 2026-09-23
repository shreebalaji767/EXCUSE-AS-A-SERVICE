(() => {

    "use strict";


    const DATA =
        window.EXCUSE_DATA || {};


    const conversations =
        Array.isArray(DATA.conversations)
            ? DATA.conversations
            : [];


    const select =
        document.getElementById(
            "conversationCount"
        );


    const countValue =
        document.getElementById(
            "countValue"
        );


    const countDisplay =
        document.getElementById(
            "countDisplay"
        );


    const minus =
        document.getElementById(
            "countMinus"
        );


    const plus =
        document.getElementById(
            "countPlus"
        );


    const generate =
        document.getElementById(
            "generateConversations"
        );


    const more =
        document.getElementById(
            "generateMore"
        );


    const container =
        document.getElementById(
            "conversationContainer"
        );


    const heading =
        document.getElementById(
            "resultHeading"
        );


    const resultCount =
        document.getElementById(
            "resultCount"
        );


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


        if (
            !counts.includes(
                number
            )
        ) {

            number = 5;

        }


        select.value =
            String(number);


        countValue.textContent =
            number;


        countDisplay.textContent =
            number;

    }


    /* RANDOM */

    function pickConversation() {

        if (
            !conversations.length
        ) {

            return null;

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
                    conversations.length
                );

        }

        while (
            used.has(index)
        );


        used.add(index);


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


    /* CARD */

    function createCard(
        conversation,
        number
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
                    ${escapeHTML(
                        conversation.title ||
                        speakers.join(" & ") ||
                        "Conversation"
                    )}
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


        const dialogue =
            document.createElement(
                "div"
            );


        dialogue.className =
            "conversation-dialogue";


        const speakerIds =
            new Map();


        messages.forEach(
            (message, index) => {

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
                        speakerIds.size
                    );

                }


                let side;


                if (
                    message.speakerId !==
                    undefined
                ) {

                    side =
                        Number(
                            message.speakerId
                        ) === 0
                            ? "incoming"
                            : "outgoing";

                }

                else {

                    side =
                        speakerIds.get(
                            speaker
                        ) % 2 === 0
                            ? "incoming"
                            : "outgoing";

                }


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "conversation-message " +
                    side;


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


                bubble.textContent =
                    String(
                        message.text ||
                        ""
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
                        "✓✓";


                    bubble.appendChild(
                        check
                    );

                }


                content.append(
                    speakerElement,
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
            async () => {

                const text =
                    messages
                        .map(
                            message =>
                                message.speaker +
                                ": " +
                                message.text
                        )
                        .join("\n");


                try {

                    await navigator
                        .clipboard
                        .writeText(text);

                }

                catch {

                    /* Clipboard unavailable */

                }


                copyButton.textContent =
                    "COPIED";


                setTimeout(
                    () => {

                        copyButton.textContent =
                            "COPY";

                    },
                    1000
                );

            }
        );


        screenshotButton.addEventListener(
            "click",
            async () => {

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
                            article,
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
                        "excuse-random-" +
                        number +
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
                RANDOM ARCHIVE
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


    /* RENDER */

    function render() {

        const amount =
            Number(
                select.value
            ) || 5;


        container.innerHTML =
            "";


        heading.textContent =
            amount +
            " RANDOM CONVERSATION" +
            (
                amount === 1
                    ? ""
                    : "S"
            );


        resultCount.textContent =
            amount;


        if (
            !conversations.length
        ) {

            container.innerHTML = `

                <div class="empty-state">

                    <div>
                        ⚠️
                    </div>

                    <h3>
                        No conversations found.
                    </h3>

                    <p>
                        Run
                        python build/generate.py
                        first.
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
                pickConversation();


            if (
                conversation
            ) {

                container.appendChild(
                    createCard(
                        conversation,
                        i + 1
                    )
                );

            }

        }

    }


    /* MINUS */

    minus?.addEventListener(
        "click",
        () => {

            const index =
                counts.indexOf(
                    Number(
                        select.value
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


    /* PLUS */

    plus?.addEventListener(
        "click",
        () => {

            const index =
                counts.indexOf(
                    Number(
                        select.value
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

    generate?.addEventListener(
        "click",
        render
    );


    /* MORE */

    more?.addEventListener(
        "click",
        render
    );


    /* INITIAL */

    setCount(5);

    render();

})();
