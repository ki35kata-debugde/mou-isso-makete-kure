window.GAME_DATA = {
  "prices": {
    "iron": {
      "buy": 20,
      "sell": 16,
      "label": "鉄"
    },
    "wood": {
      "buy": 12,
      "sell": 9,
      "label": "木材"
    },
    "niter": {
      "buy": 25,
      "sell": 20,
      "label": "硝石"
    },
    "herb": {
      "buy": 15,
      "sell": 12,
      "label": "薬草"
    },
    "food_mat": {
      "buy": 18,
      "sell": 14,
      "label": "兵糧"
    },
    "med": {
      "buy": 999,
      "sell": 30,
      "label": "回復薬"
    }
  },
  "prep_quests": {
    "food": {
      "item": "food",
      "label": "兵糧",
      "qty": 5,
      "trust_reward": 4
    },
    "horse": {
      "items": [
        {
          "item": "food",
          "label": "兵糧",
          "qty": 4
        },
        {
          "item": "med",
          "label": "回復薬",
          "qty": 1
        }
      ],
      "label": "兵糧×4・回復薬×1",
      "trust_reward": 4
    },
    "siege": {
      "item": "siege_w",
      "label": "衝車",
      "qty": 2,
      "trust_reward": 4
    },
    "weapon": {
      "item": "sword",
      "label": "剣",
      "qty": 2,
      "trust_reward": 4
    }
  },
  "node_orders": {
    "food": {
      "1": {
        "label": "兵糧×4",
        "items": [
          {
            "id": "food",
            "label": "兵糧",
            "qty": 4
          }
        ],
        "deadline": 8,
        "carts": 2,
        "trust_reward": 15
      },
      "2": {
        "label": "兵糧×6",
        "items": [
          {
            "id": "food",
            "label": "兵糧",
            "qty": 6
          }
        ],
        "deadline": 9,
        "carts": 3,
        "trust_reward": 15
      },
      "3": {
        "label": "兵糧×4・回復薬×2",
        "items": [
          {
            "id": "food",
            "label": "兵糧",
            "qty": 4
          },
          {
            "id": "med",
            "label": "回復薬",
            "qty": 2
          }
        ],
        "deadline": 10,
        "carts": 4,
        "trust_reward": 15
      },
      "4": {
        "label": "兵糧×12",
        "items": [
          {
            "id": "food",
            "label": "兵糧",
            "qty": 12
          }
        ],
        "deadline": 14,
        "carts": 6,
        "trust_reward": 20
      }
    },
    "horse": {
      "1": {
        "label": "★1以上馬×1頭",
        "items": [
          {
            "id": "horse",
            "label": "★1馬",
            "qty": 1
          }
        ],
        "deadline": 8,
        "carts": 2,
        "trust_reward": 15
      },
      "2": {
        "label": "★2以上馬×1頭",
        "items": [
          {
            "id": "horse",
            "label": "★2馬",
            "qty": 1
          }
        ],
        "deadline": 8,
        "carts": 3,
        "trust_reward": 15
      },
      "3": {
        "label": "★3馬×1",
        "items": [
          {
            "id": "horse",
            "label": "★3馬",
            "qty": 1
          }
        ],
        "deadline": 10,
        "carts": 4,
        "trust_reward": 15
      },
      "4": {
        "label": "★4馬×1",
        "items": [
          {
            "id": "horse",
            "label": "★4馬",
            "qty": 1
          }
        ],
        "deadline": 14,
        "carts": 6,
        "trust_reward": 20
      }
    },
    "siege": {
      "1": {
        "label": "衝車×2",
        "items": [
          {
            "id": "siege_w",
            "label": "衝車",
            "qty": 2
          }
        ],
        "deadline": 8,
        "carts": 2,
        "trust_reward": 15
      },
      "2": {
        "label": "衝車×4",
        "items": [
          {
            "id": "siege_w",
            "label": "衝車",
            "qty": 4
          }
        ],
        "deadline": 8,
        "carts": 3,
        "trust_reward": 15
      },
      "3": {
        "label": "投石機×3",
        "items": [
          {
            "id": "catapult",
            "label": "投石機",
            "qty": 3
          }
        ],
        "deadline": 12,
        "carts": 4,
        "trust_reward": 15
      },
      "4": {
        "label": "投石機×2・爆弾×1",
        "items": [
          {
            "id": "catapult",
            "label": "投石機",
            "qty": 2
          },
          {
            "id": "bomb",
            "label": "爆弾",
            "qty": 1
          }
        ],
        "deadline": 14,
        "carts": 6,
        "trust_reward": 20
      }
    },
    "weapon": {
      "1": {
        "label": "剣×4",
        "items": [
          {
            "id": "sword",
            "label": "剣",
            "qty": 4
          }
        ],
        "deadline": 8,
        "carts": 2,
        "trust_reward": 15
      },
      "2": {
        "label": "剣×2・弩×4",
        "items": [
          {
            "id": "sword",
            "label": "剣",
            "qty": 2
          },
          {
            "id": "crossbow2",
            "label": "弩",
            "qty": 4
          }
        ],
        "deadline": 10,
        "carts": 3,
        "trust_reward": 15
      },
      "3": {
        "label": "弩×3・名剣×1",
        "items": [
          {
            "id": "crossbow2",
            "label": "弩",
            "qty": 3
          },
          {
            "id": "fine_sword",
            "label": "名剣",
            "qty": 1
          }
        ],
        "deadline": 12,
        "carts": 4,
        "trust_reward": 15
      },
      "4": {
        "label": "名剣×2・投刀×1",
        "items": [
          {
            "id": "fine_sword",
            "label": "名剣",
            "qty": 2
          },
          {
            "id": "throwing_blade",
            "label": "投刀",
            "qty": 1
          }
        ],
        "deadline": 14,
        "carts": 6,
        "trust_reward": 20
      }
    }
  },
  "remind_after_turns": 3,
  "letters": {
    "food": {
      "demand": [
        {
          "id": "food_prep",
          "priority": 100,
          "when": {
            "node": 0
          },
          "body": "出陣する。厳しい行軍になる。水と兵糧五石、誤差なく整えよ。\n\n【出立準備依頼】兵糧×5　輸送フェーズで手渡し可"
        },
        {
          "id": "food_node_enter",
          "priority": 100,
          "when": {
            "node_gte": 1,
            "on_node_enter": true
          },
          "body": "到着した。思ったより速かった。\nこの先、兵糧が要る。送ってくれ。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後",
          "disabled": true,
          "_comment": "split into land nodes"
        },
        {
          "id": "food_order",
          "priority": 90,
          "when": {
            "node_gte": 1
          },
          "body": "前線より。兵糧の補充を求める。\n\n【依頼】{{order_label}}　納期残：およそ{{deadline}}ターン",
          "disabled": true,
          "_comment": "disabled: 毎ターン依頼/催促"
        },
        {
          "id": "food_remind",
          "priority": 95,
          "when": {
            "node_gte": 1,
            "miss_turns_gte": 3
          },
          "body": "……荷が届かぬ。兵の腹は空いている。\n催促する。今すぐ送れ。\n\n【催促】{{order_label}}",
          "disabled": true,
          "_comment": "disabled: 毎ターン依頼/催促"
        },
        {
          "id": "food_node_enter_1",
          "priority": 100,
          "when": {
            "node": 1,
            "on_node_enter": true
          },
          "body": "平地は広い。風が強く兵の歩みが乱れる。予定量を確実に届けよ。遅れは許さぬ。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "food_node_enter_2",
          "priority": 100,
          "when": {
            "node": 2,
            "on_node_enter": true
          },
          "body": "湿地で荷車が沈む。進軍が遅れた。補給量を増やせ。次の荷は急ぎ届けよ。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "food_node_enter_3",
          "priority": 100,
          "when": {
            "node": 3,
            "on_node_enter": true
          },
          "body": "昨夜数名倒れた。疲労が深い。補給を絶やすな。次の荷は兵の命を左右する。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "food_node_enter_4",
          "priority": 100,
          "when": {
            "node": 4,
            "on_node_enter": true
          },
          "body": "敵城目前。兵の士気は高い。補給は貴殿の計算が要だ。最後の荷を確実に届け。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        }
      ],
      "personal": [
        {
          "id": "food_intro",
          "priority": 100,
          "when": {
            "node": 0,
            "once": true
          },
          "intro": "先日紹介されたときにも思ったのですが、誠実な方で嬉しいです",
          "body": "秤目殿。都を離れる前に、貴殿と市場で言葉を交わした日のことを思い出している。\n他国へ出るのは初めてで、兵が「道の色が違う」と騒いでいたが、私は違いが分からず困った。\n貴殿は数字で世界を見ていると言ったな。私もこの旅で、数字の外側を知りたい。\n初めの荷は、貴殿の目を頼りにする。",
          "choices": [
            {
              "icon": "📦",
              "text": "「初めの荷は多めに積みます。未知の土地は誤差が出ます」",
              "trust": 2
            },
            {
              "icon": "📊",
              "text": "「市場の記録を添えます。判断の助けになります」",
              "trust": 1
            },
            {
              "icon": "🙏",
              "text": "「都の道とは違います。慎重に進んでください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "food_land_1",
          "priority": 100,
          "when": {
            "node": 1,
            "on_node_enter": true
          },
          "intro": "風景の描写が細かい…兵糧太様、よく見てますね",
          "body": "秤目殿。初めて見る他国の平地は、思ったより白く光っていた。兵が「砂が違う」と笑っていたが、私は初めて知った。\n風が強く、地図の端がめくれ上がるたびに兵が押さえてくれる。こういう些細なことが士気を保つのだと気づいた。\n貴殿の計算書を読み返すと、心が静まる。次の丘を越える前に、補給量の調整を頼みたい。",
          "choices": [
            {
              "icon": "🗺️",
              "text": "「地形の変化を記録してください。補給量を調整します」",
              "trust": 2
            },
            {
              "icon": "🌬️",
              "text": "「風の強さも計算に入れます。次の荷で補正します」",
              "trust": 1
            },
            {
              "icon": "📋",
              "text": "「兵の歩みが乱れないなら問題ありません」",
              "trust": 0
            }
          ]
        },
        {
          "id": "food_trust_20",
          "priority": 60,
          "when": {
            "trust_gte": 20,
            "trust_lt": 40,
            "once": true
          },
          "intro": "帳簿をご自分で…真面目な方ですね。ちょっと嬉しいです",
          "body": "秤目殿。兵糧の帳簿を初めて自分でつけてみた。都の師の教えと、貴殿の計算書は書き方がまるで違う。\n貴殿の数字は読みやすい。なぜか、温かい。\nどういう工夫をしている。教えてほしい。",
          "choices": [
            {
              "icon": "✍️",
              "text": "「数字の横に一言添えるんです。読む人のことを思って」",
              "trust": 2
            },
            {
              "icon": "📋",
              "text": "「書式をまとめて送ります。参考にしてください」",
              "trust": 1
            },
            {
              "icon": "😊",
              "text": "「慣れれば誰の数字でも読みやすくなりますよ」",
              "trust": 0
            }
          ],
          "disabled": false
        },
        {
          "id": "food_chat",
          "priority": 10,
          "when": {
            "fallback": true
          },
          "intro": "いつもの報告です。",
          "body": "市の相場は安定している。次の荷の手配を頼む。\n以上だ。",
          "choices": [
            {
              "icon": "📋",
              "text": "「承知しました」",
              "trust": 1
            },
            {
              "icon": "📊",
              "text": "在庫表を添えて返す",
              "trust": 1
            }
          ],
          "disabled": true,
          "_comment": "disabled: 雑談/シリアル"
        },
        {
          "id": "food_land_2",
          "priority": 100,
          "when": {
            "node": 2,
            "on_node_enter": true
          },
          "intro": "湿地の音を「喋る」って…兵の方が詩人ですね",
          "body": "秤目殿。丘を越えた先の湿地は、足を踏み出すたびにぬかるみが鳴った。兵が「地が喋っている」と冗談を言っていたが、私は笑い方が分からず黙ってしまった。\n歩幅を測るという貴殿の助言は役立った。疲れが深い者を早めに休ませられた。\n戦は地形との対話だと、ようやく理解した。次の補給量を再計算したい。貴殿の知恵を借りたい。",
          "choices": [
            {
              "icon": "📦",
              "text": "「湿地の負担は大きいです。補給量を増やします」",
              "trust": 2
            },
            {
              "icon": "📝",
              "text": "「荷車の沈み具合を記録してください。補正します」",
              "trust": 1
            },
            {
              "icon": "📋",
              "text": "「湿地は抜ければ楽になります。そのまま進んでください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "food_land_3",
          "priority": 100,
          "when": {
            "node": 3,
            "on_node_enter": true
          },
          "intro": "友を亡くしても耐える兵たちを、私たちの荷が支えるんですね…",
          "body": "秤目殿。昨夜、倒れた兵の名を呼ぶ声が静かな夜に響いた。湿地の疲労が抜けぬまま進んだのが原因だ。\n兵たちは黙って粥を食べている。友を亡くした者も、涙を見せず健気に耐えている。\n……これ以上、誰も失いたくない。\n貴殿の言葉がなければ、もっと失っていたかもしれぬ。\n敵城は近い。最後の補給を頼む。貴殿の計算が、兵の歩みを支えている。",
          "choices": [
            {
              "icon": "🕯️",
              "text": "「兵の名を記録します。都で香を焚きます」",
              "trust": 2
            },
            {
              "icon": "📊",
              "text": "「疲労の度合いを数字にします。判断に使ってください」",
              "trust": 1
            },
            {
              "icon": "💪",
              "text": "「敵城目前です。気を強く持ってください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "food_land_4",
          "priority": 100,
          "when": {
            "node": 4,
            "on_node_enter": true
          },
          "intro": "「影が濃い城」って…兵糧太様、詩的ですね",
          "body": "秤目殿。敵城の壁は思ったより黒く、陽を吸うように立っている。兵が「影が濃い城だ」と言っていた。\n弟たちには強く見せねばならぬが、私は怖い。兵を失うことが。\n貴殿の補給が途切れなかったから、兵の歩みは乱れていない。\nこれを越えれば戦は終わる。都に戻ったら、貴殿の市場をこの目で見たい。数字の源を知りたいのだ。",
          "choices": [
            {
              "icon": "📦",
              "text": "「最後の補給を送りました。必ず戻ってきてください」",
              "trust": 2
            },
            {
              "icon": "🙏",
              "text": "「市場の皆も祈っています。兵の士気を信じて」",
              "trust": 1
            },
            {
              "icon": "💪",
              "text": "「壁は高くても兵は強いです。勝てます」",
              "trust": 0
            }
          ]
        },
        {
          "id": "food_trust_40",
          "priority": 60,
          "when": {
            "trust_gte": 40,
            "once": true,
            "trust_lt": 60
          },
          "intro": "味の相談だなんて…数字だけの方じゃなくなってきましたね",
          "body": "秤目殿。兵から「飯が薄い」と苦情が出た。量は計算どおりだが、味は計算できぬ。\n市場には塩や味噌を商う者も多いだろう。安くて、兵の心が上がるもの。何かないか。\n貴殿の目利きを頼りたい。",
          "choices": [
            {
              "icon": "🍙",
              "text": "「干し梅を送ります。安くて日持ちして、士気が上がります」",
              "trust": 2
            },
            {
              "icon": "🍲",
              "text": "「味噌を少し。温かい汁物は心まで温めます」",
              "trust": 1
            },
            {
              "icon": "📋",
              "text": "「戦場で贅沢は禁物です。今のままで十分かと」",
              "trust": 0
            }
          ]
        },
        {
          "id": "food_trust_60",
          "priority": 60,
          "when": {
            "trust_gte": 60,
            "once": true,
            "trust_lt": 80
          },
          "intro": "眠れない夜に、私を思い出してくれたんですね…",
          "body": "秤目殿。夜、眠れぬ日が続いている。帳簿の数字を数えると少し落ち着くが、父上の顔が浮かぶと途端に狂う。\n勝てとしか言わぬ父に、私は何を証明したいのか、分からなくなってきた。\n…こんなことを書けるのは、貴殿にだけだ。",
          "choices": [
            {
              "icon": "🤝",
              "text": "「証明などいりません。兵を生かして帰る。それだけで十分です」",
              "trust": 2
            },
            {
              "icon": "🍵",
              "text": "「眠れない夜は白湯を一杯。数字より効きますよ」",
              "trust": 1
            },
            {
              "icon": "😌",
              "text": "「お父上も若い頃は、きっと同じだったはずです」",
              "trust": 0
            }
          ]
        },
        {
          "id": "food_trust_80",
          "priority": 60,
          "when": {
            "trust_gte": 80,
            "once": true,
            "trust_lt": 100
          },
          "intro": "御守りだなんて…ちゃんと計算で守ってるんですけどね",
          "body": "秤目殿。兵の間で、貴殿の計算書が「外れぬ御守り」と呼ばれている。写しを取り合っているらしい。\n…実は私も一枚、鎧の内に入れている。誰にも言うな。\n次の荷も、貴殿の数字で兵を守ってくれ。",
          "choices": [
            {
              "icon": "🔖",
              "text": "「では次の計算書には御守りの印を押しておきますね」",
              "trust": 10
            },
            {
              "icon": "📋",
              "text": "「写しを人数分お送りします。取り合いにならないように」",
              "trust": 1
            },
            {
              "icon": "😊",
              "text": "「鎧の内は汗で滲みます。胸当ての外側にどうぞ」",
              "trust": 0
            }
          ]
        },
        {
          "id": "food_trust_100",
          "priority": 60,
          "when": {
            "trust_gte": 100,
            "once": true
          },
          "intro": "一緒にお仕事…それって、その…楽しみに、しています",
          "body": "秤目殿。戦の終わりが見えてきた。\n都に戻ったあかつきには、貴殿と帳簿を並べて仕事がしたい。兵站の新しい仕組みを作る。\n数字の裏にあるものを知る貴殿とでなければ、できぬ仕事だ。\n…父上には、私から話す。",
          "choices": [
            {
              "icon": "🤝",
              "text": "「帳簿を磨いて待っています。誰よりも早く戻ってきてください」",
              "trust": 2
            },
            {
              "icon": "📝",
              "text": "「新しい仕組みの案、先にまとめておきますね」",
              "trust": 1
            },
            {
              "icon": "😊",
              "text": "「お父上へのお話、うまくいくといいですね」",
              "trust": 0
            }
          ]
        }
      ]
    },
    "horse": {
      "demand": [
        {
          "id": "horse_prep",
          "priority": 100,
          "when": {
            "node": 0
          },
          "body": "荒野へ出る。馬はよく仕上がった。補給は乱すな。\n\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可"
        },
        {
          "id": "horse_node_enter",
          "priority": 100,
          "when": {
            "node_gte": 1,
            "on_node_enter": true
          },
          "body": "着いた。草が良い。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後",
          "disabled": true,
          "_comment": "split into land nodes"
        },
        {
          "id": "horse_order",
          "priority": 90,
          "when": {
            "node_gte": 1
          },
          "body": "馬が要る。\n\n【依頼】{{order_label}}",
          "disabled": true,
          "_comment": "disabled: 毎ターン依頼/催促"
        },
        {
          "id": "horse_remind",
          "priority": 95,
          "when": {
            "node_gte": 1,
            "miss_turns_gte": 3
          },
          "body": "……馬が来ない。催促する。\n\n【催促】{{order_label}}",
          "disabled": true,
          "_comment": "disabled: 毎ターン依頼/催促"
        },
        {
          "id": "horse_node_enter_1",
          "priority": 100,
          "when": {
            "node": 1,
            "on_node_enter": true
          },
          "body": "風が強い。馬は迷わぬ。補給は予定どおり。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "horse_node_enter_2",
          "priority": 100,
          "when": {
            "node": 2,
            "on_node_enter": true
          },
          "body": "夜が冷える。馬の息が白い。補給を急げ。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "horse_node_enter_3",
          "priority": 100,
          "when": {
            "node": 3,
            "on_node_enter": true
          },
          "body": "荒野深く。蹄が削れる。補給をこまめに頼む。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "horse_node_enter_4",
          "priority": 100,
          "when": {
            "node": 4,
            "on_node_enter": true
          },
          "body": "城が見える。馬はまだ走れる。最後の補給を確実に。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        }
      ],
      "personal": [
        {
          "id": "horse_intro",
          "priority": 100,
          "when": {
            "node": 0,
            "once": true
          },
          "intro": "本当に馬が好きなんですね…恐れながら私と同じです",
          "body": "荒野の風を馬が喜んでいる。\n貴方の育てた馬に乗るのが楽しみだ。",
          "choices": [
            {
              "icon": "🐎",
              "text": "「荒野は冷えます。馬の脚をよく見てください」",
              "trust": 2
            },
            {
              "icon": "🌾",
              "text": "「干し草もたくさん送ります。みんなに分けてください」",
              "trust": 1
            },
            {
              "icon": "🙏",
              "text": "「風が強いです。無理に走らせないでください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "horse_land_1",
          "priority": 100,
          "when": {
            "node": 1,
            "on_node_enter": true
          },
          "intro": "「胸が軽くなる」って…馬と走るのが本当に好きなんですね",
          "body": "荒野の草は低い。馬の影が長い。\n走ると胸が軽くなる。",
          "choices": [
            {
              "icon": "📝",
              "text": "「馬の耳の向きを記録してください。風が読めます」",
              "trust": 2
            },
            {
              "icon": "🌾",
              "text": "「草の高さも進軍に影響します。補給量を少し増やします」",
              "trust": 1
            },
            {
              "icon": "🙏",
              "text": "「風が強いなら速度を落として進んでください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "horse_trust_20",
          "priority": 60,
          "when": {
            "trust_gte": 20,
            "trust_lt": 40,
            "once": true
          },
          "intro": "困ってるって書きながら、歩かせてあげてるんですね。ふふ",
          "body": "荒野で仔馬に出会った。\n追い払っても、どこまでもついてくる。\n仕方なく、隊列の後ろを歩かせている。\n…困っている。\n夜は早く眠れ。",
          "choices": [
            {
              "icon": "🐴",
              "text": "「その仔、よほど騎馬次様が好きなんですね。記録します」",
              "trust": 2
            },
            {
              "icon": "😊",
              "text": "「荒野の仔は用心深いのに…すごいことですよ」",
              "trust": 1
            },
            {
              "icon": "😏",
              "text": "「困ってるなら追い払えばいいのに。できないくせに」",
              "trust": 0
            }
          ],
          "disabled": false
        },
        {
          "id": "horse_foal_1",
          "priority": 40,
          "when": {
            "serial": "foal",
            "step": 0
          },
          "intro": "仔馬の話が書いてあります。",
          "body": "仔馬になつかれた。栗毛の仔だ。足元に寄ってくる。\n……困る。かわいい。",
          "choices": [
            {
              "icon": "🥰",
              "text": "「大切にしてあげてください」",
              "trust": 2
            },
            {
              "icon": "🥕",
              "text": "「ニンジン、送りましょうか」",
              "trust": 2
            }
          ],
          "disabled": true,
          "_comment": "disabled: 雑談/シリアル"
        },
        {
          "id": "horse_foal_2",
          "priority": 40,
          "when": {
            "serial": "foal",
            "step": 1
          },
          "intro": "また仔馬の話です。",
          "body": "なついた仔馬はニンジンが好きな様子だ。\n朝、ポケットに入れておくと、鼻を突っこんでくる。",
          "choices": [
            {
              "icon": "🥕",
              "text": "「ニンジン、多めに送ります」",
              "trust": 2
            },
            {
              "icon": "😄",
              "text": "「それは愛されていますね」",
              "trust": 1
            }
          ],
          "disabled": true,
          "_comment": "disabled: 雑談/シリアル"
        },
        {
          "id": "horse_foal_3",
          "priority": 40,
          "when": {
            "serial": "foal",
            "step": 2
          },
          "intro": "仔馬に名前の話……？",
          "body": "ニンジン好きの仔馬に、名前をつけようと思う。\n……何か、良い名はあるか。",
          "choices": [
            {
              "icon": "✨",
              "text": "「『暁』はどうでしょう」",
              "trust": 2
            },
            {
              "icon": "🥕",
              "text": "「正直に『ニンジン』は……」",
              "trust": 1
            },
            {
              "icon": "🎨",
              "text": "名前入りの絵を描いて返す",
              "trust": 2
            }
          ],
          "disabled": true,
          "_comment": "disabled: 雑談/シリアル"
        },
        {
          "id": "horse_chat",
          "priority": 10,
          "when": {
            "fallback": true
          },
          "intro": "短い手紙です。",
          "body": "馬は元気だ。以上。\n朝は冷える。羽織れ。",
          "choices": [
            {
              "icon": "🐴",
              "text": "「了解です」",
              "trust": 1
            },
            {
              "icon": "🎨",
              "text": "小さな馬の絵を添える",
              "trust": 1
            }
          ],
          "disabled": true,
          "_comment": "disabled: 雑談/シリアル"
        },
        {
          "id": "horse_land_2",
          "priority": 100,
          "when": {
            "node": 2,
            "on_node_enter": true
          },
          "intro": "仔馬の癖まで覚えてるなんて…優しいですね",
          "body": "夜の荒野は静かだ。馬の鼓動だけが聞こえる。\n仔馬の癖を思い出した。前脚を内に入れる癖だ。\n朝は冷える。羽織れ。",
          "choices": [
            {
              "icon": "🐎",
              "text": "「馬の体温をよく見てください。冷えは脚に出ます」",
              "trust": 2
            },
            {
              "icon": "📝",
              "text": "「仔馬の癖をまとめます。判断に使ってください」",
              "trust": 1
            },
            {
              "icon": "🙏",
              "text": "「夜は危険です。無理に進まないでください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "horse_land_3",
          "priority": 100,
          "when": {
            "node": 3,
            "on_node_enter": true
          },
          "intro": "「休め」って…騎馬次様、私のこと気遣ってくれてますね",
          "body": "荒野の石は鋭い。蹄が時折鳴る。\n貴方の「蹄の休め方」を試した。馬が楽そうだ。\n最近疲れてると聞いた。よく休め。",
          "choices": [
            {
              "icon": "🔧",
              "text": "「蹄鉄の減りを記録してください。補給に反映します」",
              "trust": 2
            },
            {
              "icon": "📝",
              "text": "「荒野の石の形を教えてください。対策します」",
              "trust": 1
            },
            {
              "icon": "🙏",
              "text": "「馬の疲れが見えるなら、少し休ませてください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "horse_land_4",
          "priority": 100,
          "when": {
            "node": 4,
            "on_node_enter": true
          },
          "intro": "「見てくれ」って…帰ってくる気でいてくれて嬉しいです",
          "body": "荒野の果ては静かだ。馬が鼻を鳴らす。\n仔馬の干し草をまた鞍袋に入れた。\n帰ったら、仔馬を見てくれるか。",
          "choices": [
            {
              "icon": "🤝",
              "text": "「帰還したら仔馬の世話、一緒にします。必ず戻ってきてください」",
              "trust": 2
            },
            {
              "icon": "📝",
              "text": "「馬の様子を最後まで記録してください。判断に使います」",
              "trust": 1
            },
            {
              "icon": "💪",
              "text": "「荒野の果てなら寒さも弱いはず。気を強く持って」",
              "trust": 0
            }
          ]
        },
        {
          "id": "horse_trust_40",
          "priority": 60,
          "when": {
            "trust_gte": 40,
            "once": true,
            "trust_lt": 60
          },
          "intro": "名前つけたら、もう家族ですよ。…つけちゃえばいいのに",
          "body": "例の仔馬、人参が好きだと分かった。\n兵の食料から少し失敬したら、手から食った。\n内緒だ。\n…名を付けるべきか、迷っている。\n最近昼は乾く。水は体にいい、貴方も忘れるな。",
          "choices": [
            {
              "icon": "🥕",
              "text": "「次の荷に人参を入れておきます。兵の分は無事です」",
              "trust": 2
            },
            {
              "icon": "📝",
              "text": "「名前、一緒に考えましょう。候補を送ります」",
              "trust": 1
            },
            {
              "icon": "😅",
              "text": "「食料の失敬はほどほどに。兵に叱られますよ」",
              "trust": 0
            }
          ]
        },
        {
          "id": "horse_trust_60",
          "priority": 60,
          "when": {
            "trust_gte": 60,
            "once": true,
            "trust_lt": 80
          },
          "intro": "寝息が同じ…そういうところ、ちゃんと聞いてるんですね",
          "body": "例の仔馬、夜になると俺のそばで眠るようになった。\n寝息が、貴方の牧場の仔と同じだ。\n生まれた場所が違っても、同じなのだな。\n冷える。手を温めろ。",
          "choices": [
            {
              "icon": "🐴",
              "text": "「うちの子たちも元気です。寝相はひどいですけど」",
              "trust": 2
            },
            {
              "icon": "😊",
              "text": "「懐いた仔の寝息は特別です。いい夢を見てますよ」",
              "trust": 1
            },
            {
              "icon": "🙏",
              "text": "「騎馬次様こそ、火の番は交代でちゃんと寝てください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "horse_trust_80",
          "priority": 60,
          "when": {
            "trust_gte": 80,
            "once": true,
            "trust_lt": 100
          },
          "intro": "絵を仲間だと思うなんて…その仔、かわいいですね",
          "body": "貴方の描いた仔馬の絵、鞍に結んだ。\n見ると落ち着く。\n例の仔に見せたら、鼻で突いてきた。\n仲間だと思ったらしい。\n疲れているときいた。時にはゆっくり休め。",
          "choices": [
            {
              "icon": "🎨",
              "text": "「帰還したら新しい絵を描きます。その仔の絵も」",
              "trust": 10
            },
            {
              "icon": "📝",
              "text": "「馬の様子を最後まで記録してください」",
              "trust": 1
            },
            {
              "icon": "🙏",
              "text": "「疲れているなら、少し休んでください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "horse_trust_100",
          "priority": 60,
          "when": {
            "trust_gte": 100,
            "once": true
          },
          "intro": "四人で走ろう、って…はい。牧場で待ってますね",
          "body": "遠征の終わりが見えてきた。\n例の仔馬、決めた。連れて帰る。\n貴方の牧場で、面倒を見てやってくれるか。\n人参が好きだ。よく食う。\n帰ったら、仔馬と、この仔と、貴方と。\n四人で走ろう。\n貴方も、無理をするな。",
          "choices": [
            {
              "icon": "🥕",
              "text": "「四人…はい！人参を畑いっぱい育てて待っています」",
              "trust": 2
            },
            {
              "icon": "🏠",
              "text": "「その仔の厩を用意しておきます。名前も一緒に」",
              "trust": 1
            },
            {
              "icon": "🙏",
              "text": "「帰り道こそ気を抜かないでください。待っています」",
              "trust": 0
            }
          ]
        }
      ]
    },
    "siege": {
      "demand": [
        {
          "id": "siege_prep",
          "priority": 100,
          "when": {
            "node": 0
          },
          "body": "攻城槌の部材を整えよ。前方衝角の角度は図面どおりに。誤差は許さぬ。\n\n【出立準備依頼】衝車×2　輸送フェーズで手渡し可"
        },
        {
          "id": "siege_node_enter",
          "priority": 100,
          "when": {
            "node_gte": 1,
            "on_node_enter": true
          },
          "body": "陣を構えた。衝車の調子は良い。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後",
          "disabled": true,
          "_comment": "split into land nodes"
        },
        {
          "id": "siege_order",
          "priority": 90,
          "when": {
            "node_gte": 1
          },
          "body": "攻城の準備が進んでいる。資材を送れ。\n\n【依頼】{{order_label}}",
          "disabled": true,
          "_comment": "disabled: 毎ターン依頼/催促"
        },
        {
          "id": "siege_remind",
          "priority": 95,
          "when": {
            "node_gte": 1,
            "miss_turns_gte": 3
          },
          "body": "資材が来ない。図面だけでは城は落ちぬ。\n催促する。\n\n【催促】{{order_label}}",
          "disabled": true,
          "_comment": "disabled: 毎ターン依頼/催促"
        },
        {
          "id": "siege_node_enter_1",
          "priority": 100,
          "when": {
            "node": 1,
            "on_node_enter": true
          },
          "body": "投石機の試作品を組んだが、腕木の反発力が弱い。支点の摩耗が原因だ。支点軸を太くし、鋼板を二枚追加せよ。角度は図面のままでよい。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "siege_node_enter_2",
          "priority": 100,
          "when": {
            "node": 2,
            "on_node_enter": true
          },
          "body": "前線で衝角を試した。角度三度の変更は正しかった。衝撃の伝達が均一になり、壁面の亀裂が広がった。次の荷は鋼板を多めに送れ。試験を続ける。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "siege_node_enter_3",
          "priority": 100,
          "when": {
            "node": 3,
            "on_node_enter": true
          },
          "body": "兵が新型兵器を扱えるようになった。予備部材を多めに送れ。損耗が出る。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "siege_node_enter_4",
          "priority": 100,
          "when": {
            "node": 4,
            "on_node_enter": true
          },
          "body": "城壁が見えた。兵器は整った。最後の部材を確実に届けよ。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        }
      ],
      "personal": [
        {
          "id": "siege_intro",
          "priority": 100,
          "when": {
            "node": 0,
            "once": true
          },
          "intro": "出陣前なのに兵器の話ばかり…でも嬉しそうですね",
          "body": "炉子殿。出陣前に新型攻城槌の試験をしたい。衝角の角度を三度だけ変えたが、理論上は壁面への衝撃が二割増す。\n兵は「十分だ」と言うが、私はもっと上を目指したい。\n君の描いた補強案を図面箱の一番上に入れた。早く荒野で試したくてたまらない。君の意見が要る。",
          "choices": [
            {
              "icon": "📐",
              "text": "「衝角の角度は三度で正解です。補強案を送ります」",
              "trust": 2
            },
            {
              "icon": "🔩",
              "text": "「材質を再確認します。弱点が出ます」",
              "trust": 1
            },
            {
              "icon": "😊",
              "text": "「兵にも少し説明してあげてください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "siege_land_1",
          "priority": 100,
          "when": {
            "node": 1,
            "on_node_enter": true
          },
          "intro": "「血が騒ぐ」って…兵器の話だと本当に楽しそうですね",
          "body": "炉子殿。荒野の入口で投石機の試作品を試した。腕木の反発力は予想より弱かったが、君の補強案を思い出し、兵に指示した。\n壁面に通用するかはまだ分からぬが、試せるだけで血が騒ぐ。\n兵は理解していないが、君なら分かる。次の改良案を聞きたい。",
          "choices": [
            {
              "icon": "📐",
              "text": "「補強案を再調整します。図面を送ります」",
              "trust": 2
            },
            {
              "icon": "📊",
              "text": "「反発力の数値を記録してください」",
              "trust": 1
            },
            {
              "icon": "😊",
              "text": "「兵の意見も少し聞いてみては？」",
              "trust": 0
            }
          ]
        },
        {
          "id": "siege_trust_20",
          "priority": 60,
          "when": {
            "trust_gte": 20,
            "trust_lt": 40,
            "once": true
          },
          "intro": "鳴りの違い、聞き分けたんですか！？すごい耳！あれ私の自信作です！",
          "body": "炉子殿。届いた鋼板の焼き入れが見事だった。同じ厚みでも、叩いたときの鳴りがまるで違う。\nあれは君の仕事か、それとも父君の仕事か。\n次の荷も同じ炉で頼みたい。理由が知りたい。",
          "choices": [
            {
              "icon": "🔥",
              "text": "「大正解、私の焼き入れです！温度の記録、全部送ります！」",
              "trust": 2
            },
            {
              "icon": "😄",
              "text": "「実は父と半分ずつです。どっちがどっちか当ててみてください！」",
              "trust": 1
            },
            {
              "icon": "📋",
              "text": "「炉の癖ですよ。深い意味はないです！」",
              "trust": 0
            }
          ],
          "disabled": false
        },
        {
          "id": "siege_chat",
          "priority": 10,
          "when": {
            "fallback": true
          },
          "intro": "短い図面メモです。",
          "body": "今日の試射は可。以上。\n次の荷を待て。",
          "choices": [
            {
              "icon": "📋",
              "text": "「了解しました」",
              "trust": 1
            },
            {
              "icon": "🔧",
              "text": "「準備を進めます」",
              "trust": 1
            }
          ],
          "disabled": true,
          "_comment": "disabled: 雑談/シリアル"
        },
        {
          "id": "siege_land_2",
          "priority": 100,
          "when": {
            "node": 2,
            "on_node_enter": true
          },
          "intro": "理論が証明されて…攻三城様、本当に嬉しそうですね",
          "body": "炉子殿。君の補強案を試したら、衝角の衝撃が見事に均一に伝わった。兵が驚いていた。\n私の理論が正しかったと証明された瞬間だ。手が震えた。\n兵器は理屈どおりに動くと美しい。君の図面がなければ到達できなかった。次の試験も見てほしい。",
          "choices": [
            {
              "icon": "📐",
              "text": "「衝角の角度は完璧です。次の案を送ります」",
              "trust": 2
            },
            {
              "icon": "📝",
              "text": "「兵の反応を記録します。改善に使ってください」",
              "trust": 1
            },
            {
              "icon": "😊",
              "text": "「嬉しい気持ち、兵にも少し伝えてあげてください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "siege_land_3",
          "priority": 100,
          "when": {
            "node": 3,
            "on_node_enter": true
          },
          "intro": "兵の皆さんと打ち解けたなんて…攻三城様、嬉しそうですね",
          "body": "炉子殿。兵たちが新型兵器を扱えるようになった。君の簡易図面を見せたら皆が「分かりやすい」と言った。私は驚いた。\n兵器は兵が使うからこそ意味があるのだと、今更ながら気づいた。\n君の明るさが兵にも伝わった。私は少し楽になった。",
          "choices": [
            {
              "icon": "📐",
              "text": "「簡易図面をさらに改良します。次の荷で送ります」",
              "trust": 2
            },
            {
              "icon": "📊",
              "text": "「兵の理解度を数字化します」",
              "trust": 1
            },
            {
              "icon": "😊",
              "text": "「皆が笑ったなら、きっと大丈夫ですよ」",
              "trust": 0
            }
          ]
        },
        {
          "id": "siege_land_4",
          "priority": 100,
          "when": {
            "node": 4,
            "on_node_enter": true
          },
          "intro": "「皆で勝てる気がする」…攻三城様が言うと重みがありますね",
          "body": "炉子殿。敵城を間近に見た。図面で知る高さと、実物の威圧はまるで別物だ。新型兵器が通用するか、少し緊張している。\nだがここまで来たみんなと一緒であれば勝てる気がする。\n君の父君の兵器と、君の図面と、兵たちの腕で城を落とす。\nこの戦が終わったら、君と一緒にたくさん新しい発明をしたい。",
          "choices": [
            {
              "icon": "🤝",
              "text": "「帰還したら、今度は橋や水車を一緒に作りましょう」",
              "trust": 2
            },
            {
              "icon": "📝",
              "text": "「兵器の最終調整を記録してください」",
              "trust": 1
            },
            {
              "icon": "💪",
              "text": "「緊張しても大丈夫です。兵が支えてくれます」",
              "trust": 0
            }
          ]
        },
        {
          "id": "siege_trust_40",
          "priority": 60,
          "when": {
            "trust_gte": 40,
            "once": true,
            "trust_lt": 60
          },
          "intro": "線を見てくれたんですか！？図面は線が命なんです！嬉しい！",
          "body": "炉子殿。君の図面は線が生きている。数字が同じでも、君の線は組み上がった時の形が見える。\n兵器のことばかり考えている私が言うのだから、間違いない。\nどうやって描いている。教えてほしい。",
          "choices": [
            {
              "icon": "✍️",
              "text": "「組む人の手の順番を想像して描くんです！次のはもっとすごいですよ」",
              "trust": 2
            },
            {
              "icon": "😄",
              "text": "「企業秘密です！でも特別に、今度教えちゃいます」",
              "trust": 1
            },
            {
              "icon": "📋",
              "text": "「線より数字を見てください。図面ですから！」",
              "trust": 0
            }
          ]
        },
        {
          "id": "siege_trust_60",
          "priority": 60,
          "when": {
            "trust_gte": 60,
            "once": true,
            "trust_lt": 80
          },
          "intro": "歯車の夢！私もしょっちゅう見ます！おかしくないです、天才の証です！",
          "body": "炉子殿。近ごろ、兵器の夢ばかり見る。歯車が音もなく噛み合っていく夢だ。\n兵に話したら妙な顔をされた。私はおかしいのだろうか。\n君の手紙を読むと、おかしくない気がしてくる。返事がほしい。",
          "choices": [
            {
              "icon": "🔥",
              "text": "「私も炉の夢ばっかり見ます！つまり私たち、天才仲間ですね！」",
              "trust": 2
            },
            {
              "icon": "💪",
              "text": "「夢に出るほど考えてる証拠です。誇ってください！」",
              "trust": 1
            },
            {
              "icon": "😄",
              "text": "「たまには美味しいものの夢も見てくださいね」",
              "trust": 0
            }
          ]
        },
        {
          "id": "siege_trust_80",
          "priority": 60,
          "when": {
            "trust_gte": 80,
            "once": true,
            "trust_lt": 100
          },
          "intro": "夕日が焼き色に見えるの、分かります！最高の焼き加減の色ですよね！",
          "body": "炉子殿。気づけば、君への手紙に兵器のことしか書いていなかった。今日は違うことを書く。\n…と思ったが、何も浮かばぬ。\n夕日が、鋼の焼き色に似ていた。以上だ。\n次からは兵器の話に戻る。",
          "choices": [
            {
              "icon": "🌇",
              "text": "「その調子です！次は雲の形もお願いします！」",
              "trust": 10
            },
            {
              "icon": "😄",
              "text": "「無理しなくていいです。兵器の話、大好きですから！」",
              "trust": 1
            },
            {
              "icon": "🌇",
              "text": "「今日の夕日、私も炉の前で見ますね！」",
              "trust": 0
            }
          ]
        },
        {
          "id": "siege_trust_100",
          "priority": 60,
          "when": {
            "trust_gte": 100,
            "once": true
          },
          "intro": "私の炉のために送風機！？やった！早く見たいです、早く帰ってきて！",
          "body": "炉子殿。君の炉に合う送風機を設計した。図面はもうできている。\n戦が終わったら、私が自分で取り付けに行く。\n君の炉の火が強くなれば、君の作るものはもっと良くなる。\nそれを、一番近くで見たい。",
          "choices": [
            {
              "icon": "🔥",
              "text": "「取り付けの日、炉をぴかぴかに磨いて待ってます！」",
              "trust": 2
            },
            {
              "icon": "📐",
              "text": "「図面を先に送ってください！父と組み立てて待ってます！」",
              "trust": 1
            },
            {
              "icon": "⚒️",
              "text": "「火が強くなったら、過去最高の鋼を打ちますね！」",
              "trust": 0
            }
          ]
        }
      ]
    },
    "weapon": {
      "demand": [
        {
          "id": "weapon_prep",
          "priority": 100,
          "when": {
            "node": 0
          },
          "body": "少数精鋭で行く。剣を二振り頼む。軽くて速いやつだ。薬はいらん。俺は怪我しない。\n\n【出立準備依頼】剣×2　輸送フェーズで手渡し可"
        },
        {
          "id": "weapon_node_enter",
          "priority": 100,
          "when": {
            "node_gte": 1,
            "on_node_enter": true
          },
          "body": "山道、余裕だった。まずここを押さえる。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後\n（ノード{{node}}）",
          "disabled": true,
          "_comment": "split into land nodes"
        },
        {
          "id": "weapon_order",
          "priority": 90,
          "when": {
            "node_gte": 1
          },
          "body": "前線より。武器の補充を求める。\n\n【依頼】{{order_label}}　納期の目安：{{deadline}}ターン",
          "disabled": true,
          "_comment": "disabled: 毎ターン依頼/催促"
        },
        {
          "id": "weapon_remind",
          "priority": 95,
          "when": {
            "node_gte": 1,
            "miss_turns_gte": 3
          },
          "body": "……荷が遅いぞ。催促だ。\n俺が一番早く終わらせるつもりが、補給待ちとはな。\n\n【催促】{{order_label}}",
          "disabled": true,
          "_comment": "disabled: 毎ターン依頼/催促"
        },
        {
          "id": "weapon_node_enter_1",
          "priority": 100,
          "when": {
            "node": 1,
            "on_node_enter": true
          },
          "body": "地形が狭い。少数で突く。剣を四振り、急げ。振るのは兵だ。俺は素手でも勝てる。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "weapon_node_enter_2",
          "priority": 100,
          "when": {
            "node": 2,
            "on_node_enter": true
          },
          "body": "俺の戦術が完璧に決まった。次は弩だ。矢の雨で敵が崩れる。剣も忘れるな。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "weapon_node_enter_3",
          "priority": 100,
          "when": {
            "node": 3,
            "on_node_enter": true
          },
          "body": "兵がよく動く。弩と名剣を頼む。回復薬はいらん。兄上たちには足りているのか？優先してそっちへ回せ。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        },
        {
          "id": "weapon_node_enter_4",
          "priority": 100,
          "when": {
            "node": 4,
            "on_node_enter": true
          },
          "body": "敵の城が見えた。剣も名剣も、ありったけ寄越せ。俺が早く終わらせる。皆を守るためだ。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後"
        }
      ],
      "personal": [
        {
          "id": "weapon_intro",
          "priority": 100,
          "when": {
            "node": 0,
            "once": true
          },
          "intro": "「敵う奴がいない」なんて真顔で言う人、初めて見ました",
          "body": "芍薬へ。\n南部の攻略、俺ひとりで十分だ。\n夜に忍び込んで将軍の首を取れば終わる。\nそなたの薬は兵にだけ使わせる。\n俺は怪我しない。俺に敵う奴なんていない。",
          "choices": [
            {
              "icon": "💊",
              "text": "「無敵気取りでも傷は負います。予備薬を持っていって」",
              "trust": 2
            },
            {
              "icon": "🌿",
              "text": "「少数精鋭なら疲労が出ます。鎮痛剤を増やします」",
              "trust": 1
            },
            {
              "icon": "😏",
              "text": "「怪我しないなら薬はいらないですね」",
              "trust": 0
            }
          ]
        },
        {
          "id": "weapon_land_1",
          "priority": 100,
          "when": {
            "node": 1,
            "on_node_enter": true
          },
          "intro": "また「敵なし」ですか…毎回言い方を変えてまで自慢するんですね",
          "body": "芍薬へ。\nこの地形、最高だ。\n少数で斜めに突けば敵は崩れる。\n兄上らは来なくていい。俺が全部やる。\nそなたの薬は勝利のあとに兵へ配る。\n俺は使わん。俺に勝てる奴はおらんからな。",
          "choices": [
            {
              "icon": "💊",
              "text": "「勝利後の兵のために回復薬を増やします」",
              "trust": 2
            },
            {
              "icon": "🌿",
              "text": "「斜め突撃の疲労を軽減する薬を送ります」",
              "trust": 1
            },
            {
              "icon": "😏",
              "text": "「無敵なら薬はいらないですね（また）」",
              "trust": 0
            }
          ]
        },
        {
          "id": "weapon_trust_20",
          "priority": 60,
          "when": {
            "trust_gte": 20,
            "trust_lt": 40,
            "once": true
          },
          "intro": "勝手に宣伝しないでください…でも、ありがとうございます",
          "body": "芍薬へ。\n兵たちが俺の強さの秘訣を聞いてくるから\n「薬房の薬草を舐めてるからだ」と答えておいた。\n商売繁盛だな。感謝しろ。\n俺は使わんが。誰にも負ける気がしない。",
          "choices": [
            {
              "icon": "💊",
              "text": "「宣伝料として薬を多めに送ります。兵に配ってください」",
              "trust": 2
            },
            {
              "icon": "📝",
              "text": "「嘘の効能は困ります。正しい使い方を書いて送ります」",
              "trust": 1
            },
            {
              "icon": "😏",
              "text": "「舐めるだけじゃ効きませんよ」",
              "trust": 0
            }
          ],
          "disabled": false
        },
        {
          "id": "weapon_trust_40",
          "priority": 60,
          "when": {
            "trust_gte": 40,
            "trust_lt": 60,
            "once": true
          },
          "intro": "行商人…あれ絶対あなたですよね？",
          "body": "芍薬へ。\nこの前、薬房に来た行商人、覚えてるか？\n妙に薬の並べ方を褒めていたやつ。\nあれ、俺だ。変装してた。\n気づかなかっただろう？俺の変装の腕も相当なもんだ。",
          "choices": [
            {
              "icon": "💰",
              "text": "「次からは薬代三倍取りますね」",
              "trust": 2
            },
            {
              "icon": "😏",
              "text": "「変装の癖、直した方がいいですよ」",
              "trust": 1
            },
            {
              "icon": "😊",
              "text": "「褒めるなら素直に来てください」",
              "trust": 0
            }
          ],
          "disabled": false
        },
        {
          "id": "weapon_chat",
          "priority": 10,
          "when": {
            "fallback": true
          },
          "intro": "軽口の手紙です。",
          "body": "今日も元気だよ〜。薬房の評判、落ちてない？\n落ちてたら三倍請求していいからね。",
          "choices": [
            {
              "icon": "💊",
              "text": "「落ちてません。安心を」",
              "trust": 1
            },
            {
              "icon": "😤",
              "text": "「三倍は聞き捨てなりません」",
              "trust": 2
            }
          ],
          "disabled": true,
          "_comment": "disabled: 雑談/シリアル"
        },
        {
          "id": "weapon_land_2",
          "priority": 100,
          "when": {
            "node": 2,
            "on_node_enter": true
          },
          "intro": "興奮して眠れないなら薬使えばいいのに…",
          "body": "芍薬へ。\n俺の理論、完璧だった。\n少数で斜めに突くと敵が勝手に崩れる。\n兵が「殿、なんで分かるんですか」と聞くから\n「俺に敵う奴はいないからだ」と言っておいた。\nそなたの薬は兵が喜んで使っている。\n俺は使わん。興奮して眠れん。",
          "choices": [
            {
              "icon": "💊",
              "text": "「興奮を抑える薬を送ります。飲んでください」",
              "trust": 2
            },
            {
              "icon": "📝",
              "text": "「兵の疲労を記録します。薬量を調整します」",
              "trust": 1
            },
            {
              "icon": "😏",
              "text": "「眠れないなら走ればいいのでは？」",
              "trust": 0
            }
          ]
        },
        {
          "id": "weapon_land_3",
          "priority": 100,
          "when": {
            "node": 3,
            "on_node_enter": true
          },
          "intro": "兵を想う気持ち、ちゃんと手紙から伝わってますよ",
          "body": "芍薬へ。\n兵の一人が、俺をかばって腕を斬られた。\n「殿は誰にも負けないから、守る価値がある」と笑っていた。\n…そなたの薬で、痛みなく眠れたそうだ。\n兵がいるから勝てる。初めてそう思った。\n薬を多めに送ってくれ。俺の分はいらん。",
          "choices": [
            {
              "icon": "💊",
              "text": "「その方のお薬は特別に調合します。お名前を教えてください」",
              "trust": 2
            },
            {
              "icon": "🌿",
              "text": "「疲労回復も多めに送ります。皆さんで使ってください」",
              "trust": 1
            },
            {
              "icon": "😊",
              "text": "「あなたの分も入れておきます。使わなくてもいいので」",
              "trust": 0
            }
          ]
        },
        {
          "id": "weapon_land_4",
          "priority": 100,
          "when": {
            "node": 4,
            "on_node_enter": true
          },
          "intro": "こんな静かな手紙…初めてです。胸が痛くなります",
          "body": "芍薬へ。\n……なあ。\n俺が誰より早く終わらせれば、\n兄上らを戦に出さずに済む。\n皆、死なずに済む。\nそう思うか。",
          "choices": [
            {
              "icon": "🤝",
              "text": "「あなたなら終わらせられます。でも一人で背負わないで」",
              "trust": 2
            },
            {
              "icon": "💪",
              "text": "「兄弟思いなのは知っています。兵も支えます」",
              "trust": 1
            },
            {
              "icon": "🙏",
              "text": "「終わらせたい気持ちは分かります。無茶はしないで」",
              "trust": 0
            }
          ]
        },
        {
          "id": "weapon_trust_60",
          "priority": 60,
          "when": {
            "trust_gte": 60,
            "once": true,
            "trust_lt": 80
          },
          "intro": "気づかれないと思ってたんですか？甘いですね",
          "body": "芍薬へ。\n……おい。\nこの前の手紙で「行商人はあなたでしょう」って書いてあったな。\n気づいてたのかよ！！\n三倍取るって本気か？\n戦なら誰にも負けん。薬代くらい負けてくれ。",
          "choices": [
            {
              "icon": "💰",
              "text": "「三倍は冗談です。二倍でいいですよ」",
              "trust": 2
            },
            {
              "icon": "😏",
              "text": "「変装の質を上げれば割引します」",
              "trust": 1
            },
            {
              "icon": "📋",
              "text": "「薬代は普通でいいです。戦に集中してください」",
              "trust": 0
            }
          ]
        },
        {
          "id": "weapon_trust_80",
          "priority": 60,
          "when": {
            "trust_gte": 80,
            "once": true,
            "trust_lt": 100
          },
          "intro": "「死なない」って約束、ちゃんと守ってくださいね",
          "body": "芍薬へ。\n兄上から手紙が来た。「無理をするな」だと。\n返事に「無理しないと兄上らが休めないだろ」と書いたら\n兵に「殿は素直じゃない」と笑われた。\n…そなたも同じことを言う気がしたから、先に言っておく。\n無理はする。だが死なん。俺に勝てる奴なんていないからな。",
          "choices": [
            {
              "icon": "💰",
              "text": "「その約束、覚えておきます。破ったら薬代十倍です」",
              "trust": 10
            },
            {
              "icon": "😊",
              "text": "「兄上様たちにも、たまには素直な返事を」",
              "trust": 1
            },
            {
              "icon": "😏",
              "text": "「無理する時点で無敵とは言えない気がします」",
              "trust": 0
            }
          ]
        },
        {
          "id": "weapon_trust_100",
          "priority": 60,
          "when": {
            "trust_gte": 100,
            "once": true
          },
          "intro": "効きすぎて訓練に遅刻…？ それは薬の勝ちです。でも、ちゃんと寝られてよかった",
          "body": "芍薬へ。\n初めて、そなたの薬を使った。\n……怪我じゃない。眠り薬の効き目を試しただけだ。\nそしたら死んだように寝て、翌朝の訓練に遅刻した。\n兵に起こされて飛び起きた。心臓に悪い。\nあれ、やばくないか？ 効きすぎだろ。\n……まあ、よく眠れたのは事実だ。礼はちゃんと言う。俺の口から。",
          "choices": [
            {
              "icon": "🤝",
              "text": "「待っています。薬房の、いつもの席で」",
              "trust": 2
            },
            {
              "icon": "💪",
              "text": "「効きすぎは仕様です。次は半量で試してください」",
              "trust": 1
            },
            {
              "icon": "🙏",
              "text": "「お礼より先に、無事な顔を見せてください」",
              "trust": 0
            }
          ]
        }
      ]
    }
  },
  "facility_lines": {
    "market": [
      "いらっしゃいませ。相場は季節で動きます。お薬や武具の完成品も、売却お受けしますよ。",
      "父上、市は賑わっています。買い時を逃さぬよう。",
      "今日の鉄は少し高めです。木材は手頃ですね。",
      "秤の目は狂いません。安心してお任せください。"
    ],
    "smith": [
      "図面、もう読み終わりました！まずは生産を指示してください。",
      "鉄の音がいい響きです。どんどん行きましょう。",
      "剣でも衝車でも、どんな注文も丁寧に仕上げますよ！",
      "炉の火がいい具合です。指示をください！"
    ],
    "pharmacy": [
      "どんどん指示してください。",
      "薬草の香りがします。回復薬、作りますよ。",
      "毒にも薬にも……ふふ、最近は半々かもしれません。",
      "急がなくていいですから、必要な数を。"
    ],
    "ranch": [
      "…今朝の仔馬、足が速そうです。",
      "……馬は元気です。",
      "草が甘い匂い。牧場は穏やかです。",
      "……また絵を描きました。馬です。",
      "……春になると、仔馬が生まれるんです。今年はどんな子でしょうね。",
      "仔馬って、生まれてすぐ立とうとするんです。……けなげだと思います。",
      "夏の仔馬は、日に日に大きくなって……見ていて飽きません。",
      "秋は……ペアを決める季節です。相性、大事にしたいです。",
      "……この子とこの子、仲良さそうですね。ペアにしてあげたいです。",
      "冬は寒いので……兵糧、多めにあげたいです。",
      "……冬に兵糧をあげると、生まれてくる仔馬が元気になるそうです。楽しみです。",
      "……馬たちは、みんな家族みたいなものです。",
      "牧場にいると、時間がゆっくり流れる気がします。……好きな時間です。"
    ]
  },
  "mat_labels": {
    "iron": "鉄",
    "wood": "木材",
    "niter": "硝石",
    "herb": "薬草",
    "food": "兵糧",
    "food_mat": "兵糧",
    "med": "回復薬",
    "sword": "剣",
    "siege_w": "衝車",
    "horse": "馬",
    "crossbow2": "弩"
  },
  "ui_strings": {
    "sortie_confirm": "他の皇子の出立には来期になります。よろしいですか？",
    "sortie_next_turn_hint": "出立は準備完了の翌ターンからです",
    "transport_after_sortie_hint": "出立したターンは輸送できません。翌ターンから送れます",
    "means_locked_cart": "兵糧ルート ノード1完遂で解禁",
    "means_locked_boat": "兵糧ルート ノード2完遂で解禁",
    "means_locked_horse": "牧場で馬を所有すると解禁",
    "means_locked_wagon": "馬ルート ノード2完遂＋荷車＋馬で解禁",
    "unlock_popup_title": "解禁のお知らせ",
    "unlock_cart": "兵糧太が遠征中に荷車を発見！荷車が解禁されました。輸送で選べます。",
    "unlock_boat": "兵糧太が遠征中に船を見かけた！船が解禁されました。河港ルートで使えます。",
    "unlock_wagon": "馬車が解禁されました。馬と荷車を組み合わせた輸送が可能です。",
    "unlock_ok": "OK",
    "go_depart": "Go → 出発",
    "go_done": "✓ 出発済み",
    "go_wait_next": "翌ターンから輸送可"
  },
  "orders": {
    "food": {
      "item_label": "兵糧×2",
      "deadline": 8
    },
    "horse": {
      "item_label": "★1以上馬×2頭",
      "deadline": 8
    },
    "siege": {
      "item_label": "衝車×2",
      "deadline": 8
    },
    "weapon": {
      "item_label": "剣×4",
      "deadline": 8
    }
  }
};
