#!/usr/bin/env python3
"""Generate high-quality TTS audio for all exercises using edge-tts."""
import asyncio
import json
import os
import sys
import subprocess

# Microsoft Edge TTS voices
VOICE_A = "zh-CN-XiaoxiaoNeural"  # Female - Speaker A
VOICE_B = "zh-CN-YunxiNeural"     # Male - Speaker B
VOICE_NARRATOR = "zh-CN-XiaoxiaoNeural"

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Exercise data - dialogue lines per exercise
EXERCISES = {
    "ex-001": {
        "title": "小明的理想职业",
        "dialogue": [
            {"speaker": "A", "text": "小明，你高考完了，想读什么专业啊？"},
            {"speaker": "B", "text": "妈，我想学中文，以后当中文老师。"},
            {"speaker": "A", "text": "当中文老师？你为什么想当老师呢？"},
            {"speaker": "B", "text": "因为我的英文和中文成绩都很好，以后可以在中国也可以在海外教中文。"},
            {"speaker": "A", "text": "那你觉得当老师有什么好处？"},
            {"speaker": "B", "text": "学生会喜欢我，我会很开心。而且老师有假期，我可以出去玩和运动。"},
            {"speaker": "A", "text": "嗯，老师这个职业确实不错。你想去哪里读大学？"},
            {"speaker": "B", "text": "我想去上海，上海有很多好大学，而且上海离南京不远，交通很方便，放假可以回家。"},
            {"speaker": "A", "text": "好主意！上海的大学确实很好。妈妈永远支持你！"},
        ]
    },
    "ex-002": {
        "title": "中秋节",
        "dialogue": [
            {"speaker": "A", "text": "小红，中秋节快到了，你们家怎么过中秋节？"},
            {"speaker": "B", "text": "我们家每年中秋节都会一起吃晚饭，然后赏月吃月饼。"},
            {"speaker": "A", "text": "你们一般吃什么菜呢？"},
            {"speaker": "B", "text": "我妈妈会做很多菜，有鱼有肉，还有汤。最重要的是月饼。"},
            {"speaker": "A", "text": "你喜欢吃什么口味的月饼？"},
            {"speaker": "B", "text": "我最喜欢莲蓉月饼，我弟弟喜欢豆沙月饼。你呢？"},
            {"speaker": "A", "text": "我喜欢五仁月饼。你觉得中秋节最重要的意义是什么？"},
            {"speaker": "B", "text": "我觉得是团圆。因为平时大家都很忙，中秋节是家人团聚的好机会。"},
        ]
    },
    "ex-003": {
        "title": "留学生活",
        "dialogue": [
            {"speaker": "A", "text": "大卫，你来中国多久了？"},
            {"speaker": "B", "text": "我来中国已经一年了。我在北京师范大学学习中文。"},
            {"speaker": "A", "text": "你觉得学中文最难的是什么？"},
            {"speaker": "B", "text": "最难的是声调。因为英文没有声调，所以我经常把声调说错。"},
            {"speaker": "A", "text": "那你的中文现在说得很好啊！你有什么学习方法吗？"},
            {"speaker": "B", "text": "我每天都跟中国朋友聊天，还看中文电视剧。我觉得多听多说最重要。"},
            {"speaker": "A", "text": "你习惯中国的生活吗？"},
            {"speaker": "B", "text": "很习惯了。我特别喜欢中国菜，尤其是四川菜。不过有时候我想家。"},
        ]
    },
    "ex-004": {
        "title": "中华传统节日",
        "dialogue": [
            {"speaker": "A", "text": "小华，你能告诉我春节是怎么过的吗？"},
            {"speaker": "B", "text": "当然可以！春节是中国最重要的节日。人们会贴春联、放鞭炮、吃年夜饭。"},
            {"speaker": "A", "text": "年夜饭一般吃什么？"},
            {"speaker": "B", "text": "每个地方不一样。北方人吃饺子，南方人吃鱼和年糕。鱼代表年年有余。"},
            {"speaker": "A", "text": "孩子们春节最开心的是什么？"},
            {"speaker": "B", "text": "当然是收红包了！长辈会给孩子们压岁钱，放在红色的信封里。"},
            {"speaker": "A", "text": "春节一般放假多长时间？"},
            {"speaker": "B", "text": "一般放假七天左右。很多人会回老家过年，所以火车站和飞机场特别忙。"},
        ]
    },
    "ex-005": {
        "title": "健康饮食",
        "dialogue": [
            {"speaker": "A", "text": "小李，你最近看起来很健康，有什么秘诀吗？"},
            {"speaker": "B", "text": "主要是改变了饮食习惯。以前我经常吃快餐，现在自己做饭了。"},
            {"speaker": "A", "text": "你一般做什么菜？"},
            {"speaker": "B", "text": "我每天吃很多蔬菜和水果，少吃肉，多喝汤。早上喝粥，中午吃饭。"},
            {"speaker": "A", "text": "你觉得中国菜和西方菜有什么不同？"},
            {"speaker": "B", "text": "中国菜喜欢用炒的方式，西方菜更多用烤的方式。而且中国人喜欢喝热水，西方人喜欢喝冷水。"},
            {"speaker": "A", "text": "你有什么建议给想健康饮食的人？"},
            {"speaker": "B", "text": "少吃油炸食品，多吃新鲜的蔬菜水果。还有，不要吃太多甜食。"},
        ]
    },
    "ex-006": {
        "title": "找工作",
        "dialogue": [
            {"speaker": "A", "text": "小张，你大学毕业了，找到工作了吗？"},
            {"speaker": "B", "text": "找到了！我在一家互联网公司做程序员。"},
            {"speaker": "A", "text": "那很好啊！你喜欢这份工作吗？"},
            {"speaker": "B", "text": "很喜欢。我对编程很感兴趣，而且工资也不错。不过工作压力比较大。"},
            {"speaker": "A", "text": "你找工作的时候遇到什么困难了吗？"},
            {"speaker": "B", "text": "面试的时候很紧张。很多公司要求有工作经验，但是刚毕业的学生没有经验。"},
            {"speaker": "A", "text": "你觉得什么样的人适合当程序员？"},
            {"speaker": "B", "text": "要有耐心，喜欢解决问题，还要不断学习新技术。因为技术变化很快。"},
        ]
    },
    "ex-007": {
        "title": "运动与健康",
        "dialogue": [
            {"speaker": "A", "text": "小王，你周末一般做什么运动？"},
            {"speaker": "B", "text": "我每个周末都去打篮球，有时候也去游泳。"},
            {"speaker": "A", "text": "你觉得运动对身体有什么好处？"},
            {"speaker": "B", "text": "运动可以让身体更强壮，还可以减轻压力。我每次运动完都觉得很开心。"},
            {"speaker": "A", "text": "你建议不爱运动的人怎么开始？"},
            {"speaker": "B", "text": "可以先从散步开始，每天走三十分钟。然后慢慢增加运动量。"},
            {"speaker": "A", "text": "中国的年轻人喜欢什么运动？"},
            {"speaker": "B", "text": "很多年轻人喜欢打羽毛球和跑步。现在越来越多的人开始练瑜伽了。"},
        ]
    },
    "ex-008": {
        "title": "旅游经历",
        "dialogue": [
            {"speaker": "A", "text": "小陈，你暑假去哪里旅游了？"},
            {"speaker": "B", "text": "我去了云南，那里风景特别美。"},
            {"speaker": "A", "text": "你去了云南哪些地方？"},
            {"speaker": "B", "text": "我去了大理、丽江和昆明。我最喜欢大理的洱海，水很清，天很蓝。"},
            {"speaker": "A", "text": "你觉得云南的菜怎么样？"},
            {"speaker": "B", "text": "云南菜很有特色，他们的米线很好吃。不过有些菜比较辣。"},
            {"speaker": "A", "text": "你有什么旅游建议给想去云南的人？"},
            {"speaker": "B", "text": "最好夏天去，天气比较凉爽。还有，要带防晒霜，因为紫外线很强。"},
        ]
    },
    "ex-009": {
        "title": "当代中国的变化",
        "dialogue": [
            {"speaker": "A", "text": "爷爷，您觉得中国这几十年变化大吗？"},
            {"speaker": "B", "text": "变化太大了！我小时候家里没有电视，现在人人都有手机。"},
            {"speaker": "A", "text": "您觉得最大的变化是什么？"},
            {"speaker": "B", "text": "交通变化最大。以前坐火车要好几天，现在坐高铁几个小时就到了。"},
            {"speaker": "A", "text": "那生活方面有什么变化？"},
            {"speaker": "B", "text": "以前买东西都要去商店，现在用手机就可以买东西，还能送到家里。"},
            {"speaker": "A", "text": "您觉得这些变化都是好的吗？"},
            {"speaker": "B", "text": "大部分是好的。不过现在年轻人都很忙，压力很大。以前虽然穷，但是生活比较轻松。"},
        ]
    },
    "ex-010": {
        "title": "龙的传说",
        "dialogue": [
            {"speaker": "A", "text": "老师，为什么中国人说自己是龙的传人？"},
            {"speaker": "B", "text": "因为在古代中国，龙是最重要的神兽。人们相信龙能带来好运和雨水。"},
            {"speaker": "A", "text": "中国的龙和西方的龙有什么不同？"},
            {"speaker": "B", "text": "中国龙的身体很长，像蛇一样，有四只脚。西方龙有翅膀，会喷火。中国龙代表吉祥，西方龙通常代表危险。"},
            {"speaker": "A", "text": "龙在中国文化中有什么意义？"},
            {"speaker": "B", "text": "龙代表权力和吉祥。古代皇帝都用龙的图案。端午节还有赛龙舟的活动。"},
            {"speaker": "A", "text": "现在中国人还喜欢龙吗？"},
            {"speaker": "B", "text": "当然！春节的时候很多人会舞龙。龙是中华民族的象征。"},
        ]
    },
    "ex-011": {
        "title": "周末休闲活动",
        "dialogue": [
            {"speaker": "A", "text": "小美，你周末喜欢做什么？"},
            {"speaker": "B", "text": "我喜欢看电影和逛街。有时候也和朋友一起去唱歌。"},
            {"speaker": "A", "text": "你最近看了什么好电影？"},
            {"speaker": "B", "text": "我最近看了一部中国科幻片，叫《流浪地球》，特别好看。"},
            {"speaker": "A", "text": "你觉得中国电影和好莱坞电影有什么不同？"},
            {"speaker": "B", "text": "中国电影更多讲家庭和感情，好莱坞电影更多是动作和冒险。不过中国电影现在越来越好了。"},
            {"speaker": "A", "text": "你有什么推荐的休闲活动？"},
            {"speaker": "B", "text": "我觉得学做饭很好，既实用又有趣。还有读书和听音乐也不错。"},
        ]
    },
    "ex-012": {
        "title": "选择大学",
        "dialogue": [
            {"speaker": "A", "text": "小林，你高考考得怎么样？"},
            {"speaker": "B", "text": "还不错，考了六百二十分。现在在考虑报哪所大学。"},
            {"speaker": "A", "text": "你想学什么专业？"},
            {"speaker": "B", "text": "我想学计算机科学。现在人工智能很热门，毕业以后工作机会多。"},
            {"speaker": "A", "text": "你考虑过哪些大学？"},
            {"speaker": "B", "text": "我在考虑清华大学和浙江大学。清华的计算机系最好，但是竞争很激烈。"},
            {"speaker": "A", "text": "你觉得选大学最重要的是什么？"},
            {"speaker": "B", "text": "我觉得专业排名比大学排名更重要。还有，要看这个大学的就业率和实习机会。"},
        ]
    },
    "ex-013": {
        "title": "学中文的好处",
        "dialogue": [
            {"speaker": "A", "text": "玛丽，你为什么要学中文？"},
            {"speaker": "B", "text": "因为我觉得中文是世界上最重要的语言之一。学中文可以了解中国文化。"},
            {"speaker": "A", "text": "你觉得学中文有什么好处？"},
            {"speaker": "B", "text": "找工作的时候很有优势。很多国际公司需要会中文的员工。而且可以和中国人直接交流。"},
            {"speaker": "A", "text": "你觉得学中文最难的是什么？"},
            {"speaker": "B", "text": "最难的是写汉字。我每天练习写汉字，但是还是经常忘记。"},
            {"speaker": "A", "text": "你有什么建议给想学中文的人？"},
            {"speaker": "B", "text": "多听中文歌，多看中文电影。还有，最好去中国生活一段时间，语言环境很重要。"},
        ]
    },
}


async def generate_line_audio(exercise_id: str, line_idx: int, text: str, speaker: str):
    """Generate audio for a single dialogue line."""
    voice = VOICE_A if speaker == "A" else VOICE_B
    output_path = os.path.join(OUTPUT_DIR, exercise_id, f"line-{line_idx:02d}.mp3")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    if os.path.exists(output_path):
        return output_path

    try:
        cmd = [
            sys.executable, "-m", "edge_tts",
            "--voice", voice,
            "--text", text,
            "--write-media", output_path,
        ]
        proc = await asyncio.create_subprocess_exec(
            *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        await proc.wait()
        return output_path
    except Exception as e:
        print(f"  ERROR: {e}")
        return None


async def generate_full_audio(exercise_id: str, dialogue: list):
    """Generate a single audio file for the full dialogue."""
    output_path = os.path.join(OUTPUT_DIR, exercise_id, "full.mp3")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    if os.path.exists(output_path):
        return output_path

    # Build full text with speaker markers
    full_text = ""
    for line in dialogue:
        full_text += line["text"] + "\n"

    # Use the female voice for the full dialogue
    try:
        cmd = [
            sys.executable, "-m", "edge_tts",
            "--voice", VOICE_A,
            "--text", full_text.strip(),
            "--write-media", output_path,
        ]
        proc = await asyncio.create_subprocess_exec(
            *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        await proc.wait()
        return output_path
    except Exception as e:
        print(f"  ERROR full: {e}")
        return None


async def main():
    print(f"Generating audio for {len(EXERCISES)} exercises...")
    print(f"Output directory: {OUTPUT_DIR}")

    for ex_id, ex_data in EXERCISES.items():
        print(f"\n  [{ex_id}] {ex_data['title']}")

        # Generate individual line audio
        for i, line in enumerate(ex_data["dialogue"]):
            result = await generate_line_audio(ex_id, i, line["text"], line["speaker"])
            if result:
                print(f"    line-{i:02d}.mp3 ✓")

        # Generate full dialogue audio
        result = await generate_full_audio(ex_id, ex_data["dialogue"])
        if result:
            print(f"    full.mp3 ✓")

    print("\nDone!")


if __name__ == "__main__":
    asyncio.run(main())
