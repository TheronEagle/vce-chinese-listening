#!/usr/bin/env python3
"""Generate TTS audio for new career/school exercises."""
import asyncio
import os
import sys

VOICE_A = "zh-CN-XiaoxiaoNeural"
VOICE_B = "zh-CN-YunxiNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio")

NEW_EXERCISES = {
    "ex-014": [
        {"speaker": "A", "text": "小雨，你大学想学什么专业？"},
        {"speaker": "B", "text": "爸，我想学艺术设计，但是妈妈说学商科比较好找工作。"},
        {"speaker": "A", "text": "那你自己怎么想？"},
        {"speaker": "B", "text": "我觉得选自己喜欢的很重要。如果做不喜欢的工作，每天都不开心。"},
        {"speaker": "A", "text": "你说得有道理。但是你也要考虑以后的收入和生活。"},
        {"speaker": "B", "text": "我知道。现在设计行业也很有前途，很多公司需要设计师。"},
        {"speaker": "A", "text": "好吧，你长大了，自己做决定。爸爸妈妈会支持你。"},
        {"speaker": "B", "text": "谢谢爸爸！我不会让你们失望的。"},
    ],
    "ex-015": [
        {"speaker": "A", "text": "小李，你最近上课总是打瞌睡，怎么了？"},
        {"speaker": "B", "text": "老师，对不起。我每天晚上做作业做到十二点多。"},
        {"speaker": "A", "text": "作业那么多吗？你一般有几科作业？"},
        {"speaker": "B", "text": "每天至少有五六科。数学和英语最多，有时候还有补习班的作业。"},
        {"speaker": "A", "text": "你还上补习班？你父母给你报的吗？"},
        {"speaker": "B", "text": "是的。他们希望我考好大学。我周末也要上课，没有时间休息。"},
        {"speaker": "A", "text": "我理解你的压力。但是睡眠很重要，你要跟父母好好谈谈。"},
        {"speaker": "B", "text": "我会试试的。谢谢老师关心。"},
    ],
    "ex-016": [
        {"speaker": "A", "text": "小王，你高中毕业后打算做什么？"},
        {"speaker": "B", "text": "我想先休息一年，就是所谓的"间隔年"。"},
        {"speaker": "A", "text": "间隔年？你想做什么呢？"},
        {"speaker": "B", "text": "我想去云南支教一年，教农村孩子英语。这样可以体验不同的生活，也能帮助别人。"},
        {"speaker": "A", "text": "听起来很有意义。你父母同意吗？"},
        {"speaker": "B", "text": "一开始他们不太同意，觉得应该直接上大学。但是后来他们理解了。"},
        {"speaker": "A", "text": "你觉得间隔年对你有什么好处？"},
        {"speaker": "B", "text": "可以让我更独立，更了解社会。而且支教经历对以后申请大学也有帮助。"},
    ],
    "ex-017": [
        {"speaker": "A", "text": "小红，你周末在咖啡店打工是吗？"},
        {"speaker": "B", "text": "是的，我在星巴克打工已经三个月了。"},
        {"speaker": "A", "text": "你觉得打工怎么样？辛苦吗？"},
        {"speaker": "B", "text": "有点累，但是很有收获。我学会了怎么做咖啡，也认识了很多朋友。"},
        {"speaker": "A", "text": "工资怎么样？够用吗？"},
        {"speaker": "B", "text": "每小时二十块，一个月大概能赚两千块。够我的生活费了。"},
        {"speaker": "A", "text": "那你学习会不会受影响？"},
        {"speaker": "B", "text": "不会，我只在周末打工。平时好好学习，周末去赚钱。"},
    ],
    "ex-018": [
        {"speaker": "A", "text": "小明，你真的想去澳大利亚留学吗？"},
        {"speaker": "B", "text": "是的，妈。澳大利亚的大学很好，而且我想提高我的英文水平。"},
        {"speaker": "A", "text": "但是留学很贵，你知道一年要多少钱吗？"},
        {"speaker": "B", "text": "我知道，学费加生活费大概要三十万一年。我可以申请奖学金，还可以打工。"},
        {"speaker": "A", "text": "你一个人在国外，我们不放心。"},
        {"speaker": "B", "text": "妈，我已经长大了。而且现在有网络，我们可以天天视频通话。"},
        {"speaker": "A", "text": "好吧，那你好好准备雅思考试吧。"},
        {"speaker": "B", "text": "谢谢妈！我一定好好努力。"},
    ],
}


async def generate_audio():
    for ex_id, lines in NEW_EXERCISES.items():
        ex_dir = os.path.join(OUTPUT_DIR, ex_id)
        os.makedirs(ex_dir, exist_ok=True)
        print(f"\n  [{ex_id}]")

        for i, line in enumerate(lines):
            out_path = os.path.join(ex_dir, f"line-{i:02d}.mp3")
            if os.path.exists(out_path):
                print(f"    line-{i:02d}.mp3 (exists)")
                continue

            voice = VOICE_A if line["speaker"] == "A" else VOICE_B
            cmd = [sys.executable, "-m", "edge_tts", "--voice", voice, "--text", line["text"], "--write-media", out_path]
            proc = await asyncio.create_subprocess_exec(*cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
            await proc.wait()
            print(f"    line-{i:02d}.mp3 ✓")

        # Full audio
        full_path = os.path.join(ex_dir, "full.mp3")
        if not os.path.exists(full_path):
            full_text = "\n".join(l["text"] for l in lines)
            cmd = [sys.executable, "-m", "edge_tts", "--voice", VOICE_A, "--text", full_text, "--write-media", full_path]
            proc = await asyncio.create_subprocess_exec(*cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
            await proc.wait()
            print(f"    full.mp3 ✓")
        else:
            print(f"    full.mp3 (exists)")

    print("\nDone!")


if __name__ == "__main__":
    asyncio.run(generate_audio())
