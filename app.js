(function () {
    "use strict";

    /* =========================================================
       1. 設定オブジェクト（設問文・配点・TYPE基準値の分離）
    ========================================================= */

    var CONFIG = {
        CTA_URL: "https://www.tamusho.jp/",
        CTA_LABEL: "田村淳の大人の小学校をもっと見る",
        SITE_NAME: "大人の小学校 楽しみ方診断",

        APP_BASE_PATH: "/howtotamusho/",
        RESULT_BASE_PATH: "/howtotamusho/result",

        GAS_URL: "https://script.google.com/macros/s/AKfycbyE8_6gfOQziXSpHk9KSICPv8sSJgtuV7mlzOBayH63UQon7WWOxrfthTFEMTXoGq9_/exec"
    };

    function buildAssetPath(path) {
        if (!path) return "";

        if (/^https?:\/\//i.test(path)) {
            return path;
        }

        var cleanPath = String(path).replace(/^\/+/, "");
        return CONFIG.APP_BASE_PATH + cleanPath;
    }

    var PARAMETER_MAX = {
        inspiration: 17,
        friendship: 18,
        discovery: 13,
        youth: 8,
        belonging: 13,
        contribution: 14
    };

    var PARAM_ORDER = ["inspiration", "friendship", "discovery", "youth", "belonging", "contribution"];

    var PARAM_LABEL = {
        inspiration: "触れる",
        friendship: "出会う",
        discovery: "知る",
        youth: "夢中になる",
        belonging: "過ごす",
        contribution: "役に立つ"
    };

    var FIXED_ORDER = ["belonging", "friendship", "discovery", "inspiration", "youth", "contribution"];

    /* ---------- コンテンツマスタ（おすすめ活動の詳細データ） ---------- */
    var CONTENT_MASTER = {
        specialTalk: {
            id: "specialTalk",
            name: "特別対談",
            description: "さまざまな業界のゲストを迎えて、オンラインで校長と対談します。普段はなかなか聞けないプロの話からたくさんの学びを得られる人気コンテンツです。",
            youtubeUrl: "https://www.youtube.com/embed/1Il0h9T9fHM",
            images: [],
            cta: null
        },
        onlineTour: {
            id: "onlineTour",
            name: "オンライン社会見学",
            description: "教頭がさまざまな企業や施設を訪れた様子を、オンラインでみんなで視聴します。仕事の様子やそこで働く人の話を知ることができます。",
            youtubeUrl: "https://www.youtube.com/embed/6vMByFt6bdw",
            images: [],
            cta: null
        },
        homeroom: {
            id: "homeroom",
            name: "ホームルーム",
            description: "校長や教頭と児童たちが、雑談を交えながら交流するオンラインホームルーム。みんなで乾杯したりゲームをしたり、新入生を歓迎したり...。大人の小学校を楽しむならまずここから！",
            youtubeUrl: "https://www.youtube.com/embed/aA58L0dVWew",
            images: [],
            cta: null
        },
        officialClub: {
            id: "officialClub",
            name: "公式クラブ",
            description: "大会への参加や制作活動など、学生時代の部活動のような熱量で取り組む活動です。これを機に新しいことへ挑戦する人もたくさんいます！",
            youtubeUrl: "https://www.youtube.com/embed/6gOY-brSTMA",
            images: [],
            cta: {
                label: "公式クラブの活動を見る",
                url: "https://www.tamusho.jp/club"
            }
        },
        cultureFestival: {
            id: "cultureFestival",
            name: "文化祭",
            description: "大人になってからもう一度、学生時代のような行事を楽しめる校内イベントのひとつ。児童主体で企画や準備を進めて、みんなが楽しめる1日を作り上げます。",
            youtubeUrl: "https://www.youtube.com/embed/LsGEJHV-DKg",
            /*
             * 【写真の追加方法】
             * 今後画像を追加する際は、以下の images 配列にオブジェクト形式で追加してください。
             * 画像が空配列 `images: []` の場合は画像エリアは描画されません。
             * 例:
             * images: [
             *   { src: "img/culture_01.avif", alt: "文化祭の様子1" },
             *   { src: "img/culture_02.avif", alt: "文化祭の様子2" }
             * ]
             */
            images: [
                { src: "img/culture_01.avif", alt: "文化祭の様子1" },
                { src: "img/culture_02.avif", alt: "文化祭の様子2" }
            ],
            cta: null
        },
        sportsDay: {
            id: "sportsDay",
            name: "運動会",
            description: "学生時代さながらの運動会を、大人になった今もう一度楽しめる校内行事。全力で熱狂しながら仲間と過ごす時間は格別です！",
            youtubeUrl: null,
            /*
             * 【写真の追加方法】
             * 今後画像を追加する際は、以下の images 配列にオブジェクト形式で追加してください。
             * 画像が空配列 `images: []` の場合は画像エリアは描画されません。
             * 例:
             * images: [
             *   { src: "img/sports_01.avif", alt: "運動会の様子1" },
             *   { src: "img/sports_02.avif", alt: "運動会の様子2" }
             * ]
             */
            images: [
                { src: "img/sports_01.avif", alt: "運動会の様子1" },
                { src: "img/sports_02.jpg", alt: "運動会の様子2" }
            ],
            cta: {
                label: "去年の様子を見る",
                url: "https://www.tamusho.jp/event/%E5%A4%A7%E4%BA%BA%E3%81%AE%E9%81%8B%E5%8B%95%E4%BC%9A2025"
            }
        },
        schoolTrip: {
            id: "schoolTrip",
            name: "修学旅行",
            description: "仲間と一緒に出かける、大人の小学校ならではの修学旅行。旅行先での思い出はもちろん、児童たちによる行き先プレゼンも楽しみの一つです。",
            youtubeUrl: "https://www.youtube.com/embed/FELmpf67mOo",
            /*
             * 【写真の追加方法】
             * 今後画像を追加する際は、以下の images 配列にオブジェクト形式で追加してください。
             * 画像が空配列 `images: []` の場合は画像エリアは描画されません。
             * 例:
             * images: [
             *   { src: "img/trip_01.jpg", alt: "修学旅行の様子1" },
             *   { src: "img/trip_02.jpg", alt: "修学旅行の様子2" }
             * ]
             */
            images: [
                { src: "img/trip_01.avif", alt: "修学旅行の様子1" },
                { src: "img/trip_02.jpg", alt: "修学旅行の様子2" }
            ],
            cta: null
        },
        chatBoard: {
            id: "chatBoard",
            name: "雑談掲示板",
            description: "オンラインの交流は専用アプリ・FANTS内で行っています。中でも児童が思い思いに雑談を繰り広げるのが雑談掲示板。積極的に投稿やコメントをして交流の一歩を踏み出しましょう！",
            youtubeUrl: null,
            images: [],
            cta: null
        },
        project: {
            id: "project",
            name: "プロジェクト",
            description: "「ひとりではできないことをみんなでカタチにする」をテーマに、さまざまなことに挑戦する企画です。今は大人の小学校オリジナルカードゲームづくり、オリジナル納豆づくりなどが進行中です。",
            youtubeUrl: "https://www.youtube.com/embed/PWOs6Lxrqns",
            images: [],
            cta: {
                label: "これまでのプロジェクトを見る",
                url: "https://www.tamusho.jp/project"
            }
        },
        offlineEvent: {
            id: "offlineEvent",
            name: "オフラインイベント",
            description: "オフラインで交流できる様々なイベントを不定期で開催しています。冬はスキー合宿、春はキャンプ、秋は遠足など、仲間と一緒に季節の思い出を作れます！",
            youtubeUrl: null,
            /*
             * 【写真の追加方法】
             * 今後画像を追加する際は、以下の images 配列にオブジェクト形式で追加してください。
             * 画像が空配列 `images: []` の場合は画像エリアは描画されません。
             * 例:
             * images: [
             *   { src: "img/offline_01.jpg", alt: "オフラインイベントの様子1" },
             *   { src: "img/offline_02.jpg", alt: "オフラインイベントの様子2" }
             * ]
             */
            images: [
                { src: "img/offline_01.avif", alt: "オフラインイベントの様子1" },
                { src: "img/offline_02.avif", alt: "オフラインイベントの様子2" }
            ],
            cta: {
                label: "これまでのイベントを見る",
                url: "https://www.tamusho.jp/event"
            }
        },
        championship: {
            id: "championship",
            name: "選手権",
            description: "主にホームルーム内で開催される企画。各回のお題に沿った動画を作ってきて、みんなで優勝を決めていきます！新しい自分を解放するチャンスです！",
            youtubeUrl: "https://www.youtube.com/embed/BFxh2zvv0uI",
            images: [],
            cta: null
        },
        onlineEvent: {
            id: "onlineEvent",
            name: "オンラインイベント",
            description: "大人の小学校はオンラインでの交流が活発で、全国から参加できます。クリスマスパーティーや入学式などもオンラインで開催しています。",
            youtubeUrl: "https://www.youtube.com/embed/j8wacw-su_w",
            images: [],
            cta: null
        }
    };

    var QUESTIONS = [
        {
            id: "q1",
            text: "最近の生活を振り返って、ふと「このまま同じ毎日でいいのかな」と思うことがある。",
            choices: [
                { key: "A", label: "強くそう思う", scores: { change: 4 } },
                { key: "B", label: "そう思う", scores: { change: 3 } },
                { key: "C", label: "あまりそう思わない", scores: { change: 1 } },
                { key: "D", label: "全くそう思わない", scores: {} }
            ]
        },
        {
            id: "q2",
            text: "ここ数年、新しいことを学んだり、初めての経験をしたりする機会が減ったと感じる。",
            choices: [
                { key: "A", label: "強くそう思う", scores: { discovery: 4 } },
                { key: "B", label: "そう思う", scores: { discovery: 3 } },
                { key: "C", label: "あまりそう思わない", scores: { discovery: 1 } },
                { key: "D", label: "全くそう思わない", scores: {} }
            ]
        },
        {
            id: "q3",
            text: "家と職場以外で、新しい人と知り合う機会がほとんどない。",
            choices: [
                { key: "A", label: "強くそう思う", scores: { friendship: 3, inspiration: 1 } },
                { key: "B", label: "そう思う", scores: { friendship: 2, inspiration: 1 } },
                { key: "C", label: "あまりそう思わない", scores: { friendship: 1 } },
                { key: "D", label: "全くそう思わない", scores: {} }
            ]
        },
        {
            id: "q4",
            text: "自分がこれまで経験してきたことを、仕事以外で誰かの役に立てる機会はあまりない。",
            choices: [
                { key: "A", label: "強くそう思う", scores: { contribution: 4 } },
                { key: "B", label: "そう思う", scores: { contribution: 3 } },
                { key: "C", label: "あまりそう思わない", scores: { contribution: 1 } },
                { key: "D", label: "全くそう思わない", scores: {} }
            ]
        },
        {
            id: "q5",
            text: "最近、「ちょっと物足りないな」と感じるとしたら、一番近いのは？",
            choices: [
                { key: "A", label: "普段会わないような面白い人との出会い", scores: { inspiration: 3 } },
                { key: "B", label: "気軽に話したり誘ったりできる友人", scores: { friendship: 3 } },
                { key: "C", label: "新しいことを知ったり体験したりする時間", scores: { discovery: 3 } },
                { key: "D", label: "仕事や家のことを忘れて楽しむ時間", scores: { youth: 3 } }
            ]
        },
        {
            id: "q6",
            text: "もし週に数時間だけ「自分のための時間」が増えたら、何に使いたい？",
            choices: [
                { key: "A", label: "今まで知らなかった世界を覗いてみたい", scores: { inspiration: 3, discovery: 1 } },
                { key: "B", label: "誰かと話したり、一緒に何かしたい", scores: { friendship: 3 } },
                { key: "C", label: "特に何かをしなくても、気楽に過ごしたい", scores: { belonging: 3 } },
                { key: "D", label: "自分が知っていることやできることを誰かに渡してみたい", scores: { contribution: 3 } }
            ]
        },
        {
            id: "q7",
            text: "人が集まるコミュニティに入るとしたら、少し気になるのは？",
            choices: [
                { key: "A", label: "すでに仲のいい人たちばかりだったら入りづらそう", scores: { belonging: 3, friendship: 1 } },
                { key: "B", label: "自分から積極的に話さないと楽しめなさそう", scores: { belonging: 3 } },
                { key: "C", label: "自分に合う人や面白い人がいるのかわからない", scores: { inspiration: 3 } },
                { key: "D", label: "見るだけで終わって、結局何もしなさそう", scores: { youth: 2, contribution: 1 } }
            ]
        },
        {
            id: "q8",
            text: "今の自分にひとつ増えたら、生活が少し楽しくなりそうなのは？",
            choices: [
                { key: "A", label: "「こんな生き方もあるんだ」と思える人との出会い", scores: { inspiration: 3 } },
                { key: "B", label: "学生時代のように気楽に話せる仲間", scores: { friendship: 3 } },
                { key: "C", label: "仕事でも家庭でもない、自分でいられる場所", scores: { belonging: 3 } },
                { key: "D", label: "「自分にもまだできることがある」と思える機会", scores: { contribution: 3 } }
            ]
        },
        {
            id: "q9",
            text: "もし大人の小学校に入ったら、ちょっとやってみたいのは？",
            choices: [
                { key: "A", label: "普段なら会えないような人の話を聞いたり話したりする", scores: { inspiration: 3 } },
                { key: "B", label: "同世代の人と、放課後みたいに話したり遊んだりする", scores: { friendship: 2, belonging: 1 } },
                { key: "C", label: "知らない場所へ行ったり、新しいことを学んだりする", scores: { discovery: 3 } },
                { key: "D", label: "文化祭や旅行など、大人になってやらなくなったことをやる", scores: { youth: 3 } }
            ]
        },
        {
            id: "q10",
            text: "1年後、「入ってよかった」と思うとしたら、一番うれしいのは？",
            choices: [
                { key: "A", label: "「この歳になって、新しい友人ができた」", scores: { friendship: 3 } },
                { key: "B", label: "「知らなかった世界をたくさん知った」", scores: { discovery: 2, inspiration: 1 } },
                { key: "C", label: "「仕事でも家でもない、自分の居場所ができた」", scores: { belonging: 3 } },
                { key: "D", label: "「自分の経験が誰かの役に立った」", scores: { contribution: 3 } }
            ]
        }
    ];

    var TYPES = {
        inspiration: {
            key: "inspiration",
            name: "校長タイプ",
            catch: "「考え方や生き方に直接触れたい」",
            description: "淳校長の価値観に共感する人。淳さんの発信・活動に以前から関心がある。",
            recommend: ["specialTalk", "onlineTour", "project", "onlineEvent"],
            message: "最初から自分をさらけ出さなくても大丈夫。まずは魅力的なゲストや同級生の話を聴くところから、刺激を受け取ってみませんか？"
        },
        friendship: {
            key: "friendship",
            name: "つながりタイプ",
            catch: "「肩書きを外して付き合える仲間がほしい」",
            description: "大人になって友達を増やしたい人。仕事・家庭以外の人間関係が少なくなっている。",
            recommend: ["homeroom", "chatBoard", "offlineEvent", "schoolTrip"],
            message: "「大人になってからの友達作り」に身構える必要はありません。ゆるい雑談や共有の趣味を通して、気づけば心地よい関係が生まれています。"
        },
        discovery: {
            key: "discovery",
            name: "学びタイプ",
            catch: "「知らない世界をもっと知りたい」",
            description: "好奇心旺盛な探究者。生活は安定しているが、新しい刺激や発見が減っている。",
            recommend: ["onlineTour", "specialTalk", "project", "officialClub"],
            message: "知識の深さは関係ありません。気になった授業や見学にふらっと参加して、「知る楽しさ」を自分のペースで味わってみましょう。"
        },
        youth: {
            key: "youth",
            name: "青春タイプ",
            catch: "「仲間と本気で何かをやりたい」",
            description: "もう一度夢中になりたい人。毎日は充実しているが、昔のような熱量や高揚感がない。",
            recommend: ["cultureFestival", "sportsDay", "schoolTrip", "championship"],
            message: "恥ずかしがる必要はゼロ。大人になった今だからこそ、適度な距離感で安心して本気の「遊び」を楽しめますよ。"
        },
        belonging: {
            key: "belonging",
            name: "居場所タイプ",
            catch: "「何者でもない自分でいられる場所がほしい」",
            description: "仕事や家庭とは違う、自分の居場所がほしい人。特別な目的がなくても、気軽に立ち寄れて自分らしくいられる場所を求めている。",
            recommend: ["homeroom", "chatBoard", "onlineEvent", "officialClub"],
            message: "無理に発言したり中心にならなくても大丈夫。まずは「見るだけ・聴くだけ」の参加から、のんびり居心地の良さを感じてくださいね。"
        },
        contribution: {
            key: "contribution",
            name: "貢献タイプ",
            catch: "「自分の経験で誰かの役に立ちたい」",
            description: "これまでの経験や得意を誰かのために活かしたい人。仕事で培った経験や人生経験を、会社とは違う場所でも役立てたい。",
            recommend: ["project", "cultureFestival", "officialClub", "championship"],
            message: "特別な実績がなくても大丈夫。あなたがこれまで過ごしてきた時間の経験や「好き」を、小さな形でみんなに「おすそわけ」してみませんか？"
        }
    };

    /* =========================================================
       2. スコアリングロジック
    ========================================================= */

    function calcRawScores(answers) {
        var raw = {
            inspiration: 0,
            friendship: 0,
            discovery: 0,
            youth: 0,
            belonging: 0,
            contribution: 0,
            change: 0
        };
        var q58 = { inspiration: 0, friendship: 0, discovery: 0, youth: 0, belonging: 0, contribution: 0 };
        var q24 = { inspiration: 0, friendship: 0, discovery: 0, youth: 0, belonging: 0, contribution: 0 };
        var q910 = { inspiration: 0, friendship: 0, discovery: 0, youth: 0, belonging: 0, contribution: 0 };

        QUESTIONS.forEach(function (q) {
            var ansKey = answers[q.id];
            if (!ansKey) return;
            var choice = q.choices.filter(function (c) { return c.key === ansKey; })[0];
            if (!choice) return;

            Object.keys(choice.scores).forEach(function (param) {
                var val = choice.scores[param];
                raw[param] += val;

                if (param !== "change") {
                    if (q.id === "q5" || q.id === "q6" || q.id === "q7" || q.id === "q8") {
                        q58[param] += val;
                    } else if (q.id === "q2" || q.id === "q3" || q.id === "q4") {
                        q24[param] += val;
                    } else if (q.id === "q9" || q.id === "q10") {
                        q910[param] += val;
                    }
                }
            });
        });

        return {
            raw: raw,
            q58: q58,
            q24: q24,
            q910: q910
        };
    }

    function normalizeScores(raw) {
        var out = {};
        PARAM_ORDER.forEach(function (p) {
            var maxVal = PARAMETER_MAX[p] || 100;
            out[p] = Math.min(100, Math.round((raw[p] / maxVal) * 100));
        });
        if (typeof raw.change === "number") {
            out.change = Math.min(100, Math.round((raw.change / 4) * 100));
        }
        return out;
    }

    function decideType(scoreData) {
        var raw = scoreData.raw;
        var q58 = scoreData.q58;
        var q24 = scoreData.q24;
        var q910 = scoreData.q910;

        var maxVal = -1;
        PARAM_ORDER.forEach(function (key) {
            if (raw[key] > maxVal) {
                maxVal = raw[key];
            }
        });

        var candidates = PARAM_ORDER.filter(function (key) {
            return raw[key] === maxVal;
        });

        if (candidates.length === 1) {
            return candidates[0];
        }

        var maxQ58 = -1;
        candidates.forEach(function (key) {
            if (q58[key] > maxQ58) maxQ58 = q58[key];
        });
        candidates = candidates.filter(function (key) {
            return q58[key] === maxQ58;
        });
        if (candidates.length === 1) {
            return candidates[0];
        }

        var maxQ24 = -1;
        candidates.forEach(function (key) {
            if (q24[key] > maxQ24) maxQ24 = q24[key];
        });
        candidates = candidates.filter(function (key) {
            return q24[key] === maxQ24;
        });
        if (candidates.length === 1) {
            return candidates[0];
        }

        var maxQ910 = -1;
        candidates.forEach(function (key) {
            if (q910[key] > maxQ910) maxQ910 = q910[key];
        });
        candidates = candidates.filter(function (key) {
            return q910[key] === maxQ910;
        });
        if (candidates.length === 1) {
            return candidates[0];
        }

        candidates.sort(function (a, b) {
            return FIXED_ORDER.indexOf(a) - FIXED_ORDER.indexOf(b);
        });

        return candidates[0];
    }

    /* =========================================================
    3. GAS連携
    ========================================================= */
    function buildGasPayload(typeKey) {
        return {
            answers: {
                q1: state.answers.q1 || "",
                q2: state.answers.q2 || "",
                q3: state.answers.q3 || "",
                q4: state.answers.q4 || "",
                q5: state.answers.q5 || "",
                q6: state.answers.q6 || "",
                q7: state.answers.q7 || "",
                q8: state.answers.q8 || "",
                q9: state.answers.q9 || "",
                q10: state.answers.q10 || ""
            },

            // 「校長タイプ」「つながりタイプ」などを送信
            resultType: TYPES[typeKey] ? TYPES[typeKey].name : ""
        };
    }


    /**
     * GASへ診断結果を送信
     */
    function sendResultToGas(typeKey) {

        // GAS URL未設定時は送信しない
        if (
            !CONFIG.GAS_URL ||
            CONFIG.GAS_URL.indexOf("XXXXXXXX") !== -1
        ) {
            console.warn("[Diagnosis] GAS_URLが設定されていません");
            return;
        }


        // 二重送信防止
        if (state.gasSent) {
            console.log("[Diagnosis] GAS送信済み");
            return;
        }


        var payload = buildGasPayload(typeKey);


        fetch(CONFIG.GAS_URL, {
            method: "POST",

            /*
             * GASでは application/json だと
             * CORS preflight が発生することがあるため
             * text/plain でJSON文字列を送信
             */
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify(payload)
        })
            .then(function (response) {

                if (!response.ok) {
                    throw new Error(
                        "HTTP Error: " + response.status
                    );
                }

                return response.json();
            })
            .then(function (data) {

                if (!data || data.success !== true) {
                    throw new Error(
                        data && data.message
                            ? data.message
                            : "GAS保存に失敗しました"
                    );
                }

                // 送信成功
                state.gasSent = true;
                persist();

                console.log(
                    "[Diagnosis] GAS保存成功",
                    payload
                );
            })
            .catch(function (error) {

                /*
                 * GAS保存失敗でも
                 * 診断結果ページは通常通り表示する
                 */
                console.error(
                    "[Diagnosis] GAS送信エラー",
                    error
                );
            });
    }
    /* =========================================================
       4. 計測（dataLayer）
    ========================================================= */

    window.dataLayer = window.dataLayer || [];
    function pushEvent(payload) {
        try { window.dataLayer.push(payload); } catch (e) { }
    }

    /* =========================================================
       4. セッションストレージ
    ========================================================= */

    var STORAGE_KEY = "otonasho_diagnosis_v2";
    function safeSessionGet() {
        try {
            var raw = window.sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }
    function safeSessionSet(obj) {
        try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) { }
    }

    /* =========================================================
       5. ユーティリティ
    ========================================================= */

    function uuidv4() {
        if (window.crypto && window.crypto.randomUUID) { return window.crypto.randomUUID(); }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getUTM() {
        var params = new URLSearchParams(window.location.search);
        return {
            source: params.get("utm_source") || "",
            medium: params.get("utm_medium") || "",
            campaign: params.get("utm_campaign") || "",
            content: params.get("utm_content") || "",
            term: params.get("utm_term") || ""
        };
    }

    function getDeviceCategory() {
        var w = window.innerWidth;
        if (w < 768) return "sp";
        if (w < 1024) return "tablet";
        return "pc";
    }

    function escapeHTML(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c];
        });
    }

    /* =========================================================
       6. アプリ状態
    ========================================================= */

    var state = {
        screen: "top", // top / quiz / judging / result
        currentQuestion: 0,
        answers: {},
        sessionId: null,
        startedAt: null,
        completedAt: null,
        completed: false,
        utm: getUTM(),
        referrer: document.referrer || "",
        isDirectResultAccess: false,
        resultType: null,
        rawScores: null,
        scores: null,
        gasSent: false
    };

    function persist() {
        safeSessionSet({
            sessionId: state.sessionId,
            startedAt: state.startedAt,
            answers: state.answers,
            currentQuestion: state.currentQuestion,
            utm: state.utm,
            completed: state.completed,
            gasSent: state.gasSent
        });
    }

    /* =========================================================
       7. 初期化：URL直リンク（/result?type=xxx）対応
    ========================================================= */

    function initFromURL() {
        var params = new URLSearchParams(window.location.search);
        var typeParam = params.get("type");
        var looksLikeResultURL = window.location.pathname.indexOf("result") !== -1 || !!typeParam;

        if (looksLikeResultURL) {
            if (typeParam && TYPES[typeParam]) {
                state.isDirectResultAccess = true;
                state.resultType = typeParam;
                var defaultScores = {};
                PARAM_ORDER.forEach(function (p) {
                    defaultScores[p] = (p === typeParam) ? 85 : 45;
                });
                state.scores = defaultScores;
                state.rawScores = null;
                state.screen = "result";
                return true;
            } else {
                history.replaceState({}, "", CONFIG.APP_BASE_PATH);
                state.screen = "top";
                return true;
            }
        }
        return false;
    }

    function restoreFromSession() {
        var saved = safeSessionGet();
        if (saved && !saved.completed) {
            state.sessionId = saved.sessionId;
            state.startedAt = saved.startedAt;
            state.answers = saved.answers || {};
            state.currentQuestion = saved.currentQuestion || 0;
            state.utm = saved.utm || state.utm;
            state.gasSent = saved.gasSent || false;
            state.screen = "quiz";
            return true;
        }
        return false;
    }

    /* =========================================================
       8. レンダリング
    ========================================================= */

    var root = document.getElementById("app-root");

    function render() {
        if (state.screen === "top") return renderTop();
        if (state.screen === "quiz") return renderQuiz();
        if (state.screen === "judging") return renderJudging();
        if (state.screen === "result") return renderResult();
    }

    function renderTop() {
        root.innerHTML =
            '<section class="screen top-hero">' +
            '<h1 class="top-title">大人の小学校<br><em>楽しみ方診断</em></h1>' +
            '<p class="top-catch">10の質問でわかる、あなたにぴったりの<br>「大人の小学校」の楽しみ方。</p>' +
            '<div class="top-meta"><img src="' + buildAssetPath("img/main-visual.png") + '" alt="全10問 約2分 結果は6タイプ"></div>' +
            '<button class="btn-primary" id="btn-start" type="button">診断をはじめる</button>' +
            '<p class="top-note">※よりよい診断づくりのため、回答と診断結果を匿名で集計しています。<br>個人を特定する情報は収集していません。</p>' +
            '<a href="https://www.tamusho.jp/"><p class="top-note">運営：田村淳の大人の小学校</p></a>' +
            '</section>';

        document.getElementById("btn-start").addEventListener("click", startDiagnosis);
        pushEvent({ event: "diagnosis_view" });
    }

    function startDiagnosis() {
        state.sessionId = uuidv4();
        state.startedAt = new Date().toISOString();
        state.answers = {};
        state.currentQuestion = 0;
        state.completed = false;
        persist();
        state.screen = "quiz";
        render();
        pushEvent({ event: "diagnosis_start", session_id: state.sessionId });
    }

    function renderQuiz() {
        var idx = state.currentQuestion;
        var q = QUESTIONS[idx];
        var progressPct = Math.round(((idx) / QUESTIONS.length) * 100);
        var selected = state.answers[q.id] || null;

        var choicesHTML = q.choices.map(function (c) {
            var isSel = selected === c.key;
            return (
                '<button type="button" class="choice' + (isSel ? " selected" : "") + '" ' +
                'data-key="' + c.key + '" role="radio" aria-checked="' + (isSel ? "true" : "false") + '">' +
                '<span class="choice-letter">' + c.key + '</span>' +
                '<span class="choice-label">' + escapeHTML(c.label) + '</span>' +
                '<span class="choice-check" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none">' +
                '<path d="M3 8.5l3.2 3L13 4" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
                '</svg></span>' +
                '</button>'
            );
        }).join("");

        root.innerHTML =
            '<section class="screen">' +
            '<div class="quiz-header">' +
            '<div class="quiz-nametag">' +
            '<button type="button" class="quiz-back" id="btn-back" ' + (idx === 0 ? "disabled" : "") + ' aria-label="前の設問に戻る">←</button>' +
            '<div class="quiz-count" aria-live="polite"><b>' + (idx + 1) + '</b><span>/ ' + QUESTIONS.length + '</span></div>' +
            '</div>' +
            '<div class="progress-track"><div class="progress-fill" id="progress-fill" style="width:' + progressPct + '%"></div></div>' +
            '</div>' +
            '<div class="question-card">' +
            '<p class="question-text">' + escapeHTML(q.text) + '</p>' +
            '</div>' +
            '<div class="choices" role="radiogroup" aria-label="' + escapeHTML(q.text) + '">' + choicesHTML + '</div>' +
            '</section>';

        requestAnimationFrame(function () {
            var fill = document.getElementById("progress-fill");
            if (fill) fill.style.width = Math.round(((idx + 1) / QUESTIONS.length) * 100) + "%";
        });

        document.getElementById("btn-back").addEventListener("click", goBack);
        Array.prototype.forEach.call(document.querySelectorAll(".choice"), function (btn) {
            btn.addEventListener("click", function () { selectAnswer(q.id, btn.getAttribute("data-key")); });
            btn.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectAnswer(q.id, btn.getAttribute("data-key"));
                }
            });
        });
    }

    function selectAnswer(questionId, key) {
        state.answers[questionId] = key;
        persist();
        pushEvent({ event: "diagnosis_answer", session_id: state.sessionId, question_id: questionId, answer: key });

        var isLast = state.currentQuestion === QUESTIONS.length - 1;
        var choiceEl = document.querySelector('.choice[data-key="' + key + '"]');
        if (choiceEl) choiceEl.classList.add("selected");

        window.setTimeout(function () {
            if (isLast) {
                goToJudging();
            } else {
                state.currentQuestion += 1;
                persist();
                render();
            }
        }, 260);
    }

    function goBack() {
        if (state.currentQuestion === 0) return;
        pushEvent({ event: "diagnosis_back", question_id: QUESTIONS[state.currentQuestion].id });
        state.currentQuestion -= 1;
        persist();
        render();
    }

    function goToJudging() {
        state.screen = "judging";
        render();
        var delay = 500 + Math.floor(Math.random() * 700); // 500〜1200ms
        window.setTimeout(function () {
            finalizeResult();
        }, delay);
    }

    function renderJudging() {
        root.innerHTML =
            '<section class="screen judging">' +
            '<div class="judging-ring" aria-hidden="true"></div>' +
            '<p class="judging-text">あなたの楽しみ方を診断中…</p>' +
            '</section>';
    }

    function finalizeResult() {
        var scoreData = calcRawScores(state.answers);
        var scores = normalizeScores(scoreData.raw);
        var typeKey = decideType(scoreData);

        state.rawScores = scoreData.raw;
        state.scores = scores;
        state.resultType = typeKey;
        state.completedAt = new Date().toISOString();

        if (!state.completed) {
            state.completed = true;
            persist();

            pushEvent({
                event: "diagnosis_complete",
                result_type: typeKey,
                inspiration: scores.inspiration,
                friendship: scores.friendship,
                discovery: scores.discovery,
                youth: scores.youth,
                belonging: scores.belonging,
                contribution: scores.contribution,
                change: scores.change
            });

            sendResultToGas(typeKey);
        }
        state.screen = "result";
        var url = CONFIG.RESULT_BASE_PATH + "?type=" + typeKey;
        try { history.pushState({}, "", url); } catch (e) { }
        document.title = "「" + TYPES[typeKey].name + "」タイプ｜" + CONFIG.SITE_NAME;
        render();
    }

    function renderResult() {
        var type = TYPES[state.resultType];
        var scores = state.scores;

        var recommendHTML = type.recommend.map(function (rKey) {
            var item = CONTENT_MASTER[rKey];
            if (!item) return "";
            return (
                '<button type="button" class="recommend-item" data-activity="' + escapeHTML(rKey) + '">' +
                '<span class="recommend-item__name">' + escapeHTML(item.name) + '</span>' +
                '<span class="recommend-item__detail">' +
                '<span>詳しく見る</span>' +
                '<svg class="recommend-item__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
                '<path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                '</svg>' +
                '</span>' +
                '</button>'
            );
        }).join("");

        var paramRowsHTML = PARAM_ORDER.map(function (p) {
            return (
                '<div class="param-row">' +
                '<div class="p-label">' + PARAM_LABEL[p] + '</div>' +
                '<div class="p-gauge"><div class="p-gauge-fill" data-param="' + p + '" style="width:0%"></div></div>' +
                '<div class="p-value">' + scores[p] + '</div>' +
                '</div>'
            );
        }).join("");

        var shareText = buildShareText(type);
        var shareUrl = buildShareURL(type.key);
        var twitterIntent = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&url=" + encodeURIComponent(shareUrl);

        root.innerHTML =
            '<section class="screen">' +
            '<p class="result-eyebrow">あなたの診断結果は…</p>' +
            '<h1 class="result-type-name">' + escapeHTML(type.name) + '</h1>' +
            '<div class="result-visual">' + svgTypeVisual(type.key) + '</div>' +
            '<p class="result-catch">' + escapeHTML(type.catch) + '</p>' +

            '<div class="result-card">' +
            '<h2>あなたへのひとこと</h2>' +
            '<div class="result-message">' + escapeHTML(type.message) + '</div>' +
            '</div>' +

            '<div class="result-card">' +
            '<h2>あなたが今、求めているもの</h2>' +
            '<div class="radar-wrap">' + buildRadarSVG(scores) + '</div>' +
            '<div class="param-list">' + paramRowsHTML + '</div>' +
            '</div>' +

            '<div class="result-card">' +
            '<h2>おすすめの楽しみ方</h2>' +
            '<div class="recommend-list">' + recommendHTML + '</div>' +
            '</div>' +

            '<a class="share-btn" id="btn-share" href="' + twitterIntent + '" target="_blank" rel="noopener noreferrer">' +
            shareIcon() + '結果をXでシェア' +
            '</a>' +

            '<div class="cta-block">' +
            '<a class="cta-btn" id="btn-cta" href="' + CONFIG.CTA_URL + '" target="_blank" rel="noopener noreferrer">' + CONFIG.CTA_LABEL + '</a>' +
            '</div>' +

            '<button type="button" class="retry-btn" id="btn-retry">もう一度診断する</button>' +
            '</section>' +
            '<footer class="foot">© 田村淳の大人の小学校 楽しみ方診断</footer>';

        requestAnimationFrame(function () {
            var radarData = document.querySelector(".radar-data");
            if (radarData) radarData.classList.add("grown");
            PARAM_ORDER.forEach(function (p) {
                var el = document.querySelector('.p-gauge-fill[data-param="' + p + '"]');
                if (el) el.style.width = scores[p] + "%";
            });
        });

        // おすすめアイテムクリックイベント追加
        Array.prototype.forEach.call(document.querySelectorAll(".recommend-item"), function (btn) {
            btn.addEventListener("click", function () {
                var activityKey = btn.getAttribute("data-activity");
                openActivityModal(activityKey, btn);
            });
        });

        document.getElementById("btn-share").addEventListener("click", function () {
            pushEvent({ event: "diagnosis_share_x", result_type: type.key });
        });
        document.getElementById("btn-cta").addEventListener("click", function () {
            pushEvent({ event: "diagnosis_cta_click", result_type: type.key });
        });
        document.getElementById("btn-retry").addEventListener("click", retryDiagnosis);

        updateOGP(type);
    }

    /* =========================================================
       9. おすすめアクティビティ モーダル制御（アクセシビリティ対応）
    ========================================================= */

    var modalLastFocusedElement = null;
    var currentModalActivityKey = null;

    function openActivityModal(activityKey, triggerElement) {
        var item = CONTENT_MASTER[activityKey];
        if (!item) return;

        currentModalActivityKey = activityKey;
        modalLastFocusedElement = triggerElement || document.activeElement;

        // 計測イベント
        pushEvent({
            event: "diagnosis_recommend_open",
            result_type: state.resultType,
            activity: activityKey
        });

        // モーダルDOMの取得または新規作成
        var modalEl = document.getElementById("activity-modal");
        if (!modalEl) {
            modalEl = document.createElement("div");
            modalEl.id = "activity-modal";
            modalEl.className = "activity-modal";
            modalEl.setAttribute("role", "dialog");
            modalEl.setAttribute("aria-modal", "true");
            modalEl.setAttribute("aria-labelledby", "activity-modal-title");
            modalEl.setAttribute("tabindex", "-1");
            document.body.appendChild(modalEl);
        }

        // 動画コンテンツHTML構築 (YouTube embed URLをiframe srcに埋め込み)
        var videoHTML = "";
        if (item.youtubeUrl) {
            videoHTML =
                '<div class="activity-modal__video">' +
                '<iframe src="' + escapeHTML(item.youtubeUrl) + '" ' +
                'title="' + escapeHTML(item.name) + ' YouTube動画" ' +
                'frameborder="0" ' +
                'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
                'referrerpolicy="strict-origin-when-cross-origin" ' +
                'allowfullscreen></iframe>' +
                '</div>';
        }

        // 画像コンテンツHTML構築（images配列に要素が存在する場合のみ出力）
        var imagesHTML = "";
        if (item.images && item.images.length > 0) {
            var imgs = item.images.map(function (imgObj) {
                var src = typeof imgObj === "string" ? imgObj : imgObj.src;
                var imageSrc = buildAssetPath(src);
                var alt = (typeof imgObj === "object" && imgObj.alt) ? imgObj.alt : item.name;
                return '<img src="' + escapeHTML(imageSrc) + '" alt="' + escapeHTML(alt) + '" class="activity-modal__image">';
            }).join("");
            imagesHTML = '<div class="activity-modal__images">' + imgs + '</div>';
        }

        // CTAボタンHTML構築（ctaデータが存在する場合のみ出力）
        var ctaHTML = "";
        if (item.cta && item.cta.url && item.cta.label) {
            ctaHTML =
                '<div class="activity-modal__cta-wrap">' +
                '<a href="' + escapeHTML(item.cta.url) + '" class="activity-modal__cta" id="activity-modal-cta-btn" target="_blank" rel="noopener noreferrer">' +
                '<span>' + escapeHTML(item.cta.label) + '</span>' +
                '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
                '<path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                '</svg>' +
                '</a>' +
                '</div>';
        }

        modalEl.innerHTML =
            '<div class="activity-modal__overlay" id="activity-modal-overlay"></div>' +
            '<div class="activity-modal__dialog" role="document">' +
            '<button type="button" class="activity-modal__close" id="activity-modal-close" aria-label="閉じる">' +
            '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
            '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
            '</button>' +
            '<div class="activity-modal__content">' +
            '<h3 class="activity-modal__title" id="activity-modal-title">' + escapeHTML(item.name) + '</h3>' +
            '<p class="activity-modal__description">' + escapeHTML(item.description) + '</p>' +
            videoHTML +
            imagesHTML +
            ctaHTML +
            '</div>' +
            '</div>';

        // イベントバインド
        document.getElementById("activity-modal-overlay").addEventListener("click", closeActivityModal);
        document.getElementById("activity-modal-close").addEventListener("click", closeActivityModal);

        var modalCtaBtn = document.getElementById("activity-modal-cta-btn");
        if (modalCtaBtn) {
            modalCtaBtn.addEventListener("click", function () {
                pushEvent({
                    event: "diagnosis_recommend_cta_click",
                    result_type: state.resultType,
                    activity: currentModalActivityKey
                });
            });
        }

        // 背景のスクロール禁止
        document.body.classList.add("has-modal");

        // 表示化
        modalEl.classList.add("is-open");

        // フォーカス設定
        var closeBtn = document.getElementById("activity-modal-close");
        if (closeBtn) closeBtn.focus();

        // キーボード操作対応 (Escapeキーで閉じる, フォーカストラップ)
        document.addEventListener("keydown", handleModalKeydown);
    }

    function closeActivityModal() {
        var modalEl = document.getElementById("activity-modal");
        if (!modalEl || !modalEl.classList.contains("is-open")) return;

        // キーボードリスナー解除
        document.removeEventListener("keydown", handleModalKeydown);

        // 動画停止（iframe srcの消去）
        var iframe = modalEl.querySelector("iframe");
        if (iframe) {
            iframe.src = "";
        }

        modalEl.classList.remove("is-open");
        document.body.classList.remove("has-modal");

        // 元のトリガー要素へフォーカス復帰
        if (modalLastFocusedElement && typeof modalLastFocusedElement.focus === "function") {
            modalLastFocusedElement.focus();
        }

        modalLastFocusedElement = null;
        currentModalActivityKey = null;
    }

    function handleModalKeydown(e) {
        var modalEl = document.getElementById("activity-modal");
        if (!modalEl || !modalEl.classList.contains("is-open")) return;

        if (e.key === "Escape") {
            e.preventDefault();
            closeActivityModal();
            return;
        }

        if (e.key === "Tab") {
            var focusables = modalEl.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
            if (focusables.length === 0) return;

            var first = focusables[0];
            var last = focusables[focusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    function updateOGP(type) {
        document.title = "「" + type.name + "」タイプ｜" + CONFIG.SITE_NAME;
        setMeta("og:title", CONFIG.SITE_NAME + "：あなたは「" + type.name + "」タイプ！");
        setMeta("og:description", type.catch);
    }
    function setMeta(prop, content) {
        var el = document.querySelector('meta[property="' + prop + '"]');
        if (el) el.setAttribute("content", content);
    }

    function buildShareText(type) {
        return (
            "私の「大人の小学校 楽しみ方診断」は\n" +
            "「" + type.name + "」でした🎒\n\n" +
            type.catch + "\n\n" +
            "あなたはどんな楽しみ方タイプ？\n\n" +
            "#大人の小学校楽しみ方診断\n" +
            "#田村淳の大人の小学校"
        );
    }

    function buildShareURL(typeKey) {
        var origin = window.location.origin || "";
        return origin + CONFIG.RESULT_BASE_PATH + "?type=" + typeKey;
    }

    function shareIcon() {
        return '<img src="' + buildAssetPath("img/x_logo.png") + '" alt="X" class="share-icon">';
    }

    /* ---------- レーダーチャート（SVG 6軸） ---------- */

    function polarPoint(cx, cy, r, angleDeg) {
        var rad = (angleDeg - 90) * Math.PI / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }

    function buildRadarSVG(scores) {
        var cx = 150, cy = 150, maxR = 100;
        var levels = [20, 40, 60, 80, 100];

        var gridPolys = levels.map(function (lv) {
            var pts = PARAM_ORDER.map(function (p, i) {
                var pt = polarPoint(cx, cy, (lv / 100) * maxR, i * 60);
                return pt.x.toFixed(1) + "," + pt.y.toFixed(1);
            }).join(" ");
            return '<polygon points="' + pts + '" fill="none" stroke="#e8e2d4" stroke-width="1"/>';
        }).join("");

        var axisLines = PARAM_ORDER.map(function (p, i) {
            var pt = polarPoint(cx, cy, maxR, i * 60);
            return '<line x1="' + cx + '" y1="' + cy + '" x2="' + pt.x.toFixed(1) + '" y2="' + pt.y.toFixed(1) + '" stroke="#e8e2d4" stroke-width="1"/>';
        }).join("");

        var labelEls = PARAM_ORDER.map(function (p, i) {
            var lab = PARAM_LABEL[p];
            var pt = polarPoint(cx, cy, maxR + 20, i * 60);
            var anchor = "middle";
            if (pt.x < cx - 5) anchor = "end";
            else if (pt.x > cx + 5) anchor = "start";
            var yAdjust = pt.y;
            if (i === 0) yAdjust -= 2;
            if (i === 3) yAdjust += 6;
            return '<text x="' + pt.x.toFixed(1) + '" y="' + yAdjust.toFixed(1) + '" text-anchor="' + anchor + '" font-size="13" font-weight="700" fill="#0c7b7b">' + escapeHTML(lab) + '</text>';
        }).join("");

        var dataPts = PARAM_ORDER.map(function (p, i) {
            var scoreVal = (scores && typeof scores[p] === "number") ? scores[p] : 0;
            var pt = polarPoint(cx, cy, (scoreVal / 100) * maxR, i * 60);
            return pt.x.toFixed(1) + "," + pt.y.toFixed(1);
        }).join(" ");

        return (
            '<svg class="radar-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="6つの気持ちのレーダーチャート">' +
            gridPolys + axisLines +
            '<polygon class="radar-data" points="' + dataPts + '" fill="rgba(231,91,71,0.28)" stroke="#e75b47" stroke-width="2.5" stroke-linejoin="round"/>' +
            labelEls +
            '</svg>'
        );
    }

    /* ---------- タイプ別ビジュアル ---------- */

    function svgTypeVisual(typeKey) {
        var glyphs = {
            inspiration: "✨",
            friendship: "💬",
            discovery: "🔍",
            youth: "🎒",
            belonging: "🏠",
            contribution: "🎁"
        };
        var glyph = glyphs[typeKey] || "🎒";
        return (
            '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<circle cx="100" cy="100" r="92" fill="#e6f2f2"/>' +
            '<circle cx="100" cy="100" r="92" fill="none" stroke="#0c7b7b" stroke-width="2" stroke-dasharray="6 6"/>' +
            '<text x="100" y="118" font-size="72" text-anchor="middle">' + glyph + '</text>' +
            '</svg>'
        );
    }

    /* ---------- 再診断 ---------- */

    function retryDiagnosis() {
        pushEvent({ event: "diagnosis_retry", previous_result_type: state.resultType });
        state.answers = {};
        state.currentQuestion = 0;
        state.completed = false;
        state.resultType = null;
        state.rawScores = null;
        state.scores = null;
        state.gasSent = false;
        state.sessionId = uuidv4();
        state.startedAt = new Date().toISOString();
        state.isDirectResultAccess = false;
        persist();
        try { history.pushState({}, "", CONFIG.APP_BASE_PATH); } catch (e) { }
        document.title = CONFIG.SITE_NAME;
        setMeta("og:title", CONFIG.SITE_NAME);
        setMeta("og:description", "10の質問でわかる、あなたにぴったりの「大人の小学校」の楽しみ方。");
        state.screen = "top";
        render();
    }

    /* =========================================================
       10. 起動
    ========================================================= */

    function boot() {
        var handledByURL = initFromURL();
        if (!handledByURL) {
            restoreFromSession();
        }
        render();

        pushEvent({
            event: "diagnosis_context",
            referrer: state.referrer,
            device_category: getDeviceCategory(),
            screen_width: window.screen ? window.screen.width : null,
            utm: state.utm
        });
    }

    boot();
})();
