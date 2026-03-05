#!/usr/bin/env python3
"""
导出 TFLite 意图分类模型：输入 32 维特征，输出 4 类意图 (greet, math, thanks, other)。
与 Android 端特征提取约定一致：32 个关键词/短语的 0/1 特征。
"""
import os
import numpy as np

try:
    import tensorflow as tf
except ImportError:
    print("请安装: pip install tensorflow")
    raise

# 与 Android TFLiteChatModule 中的 KEYWORDS 顺序一致（32 维）
KEYWORDS = [
    "你好", "hello", "hi", "嗨", "早上", "下午", "晚上",
    "数学", "算式", "计算", "加减", "乘除", "应用题",
    "语文", "英语", "总结", "概括", "讲解", "题目",
    "谢谢", "感谢", "多谢", "不客气",
    "练习", "做题", "错题", "进度", "设置",
    "再见", "拜拜", "再会",
]
assert len(KEYWORDS) == 32, "需保持 32 维"

INTENTS = ["greet", "math", "thanks", "other"]  # 4 类
NUM_FEATURES = 32
NUM_CLASSES = 4


def text_to_features(text: str) -> np.ndarray:
    """将一句话转为 32 维 0/1 特征。"""
    t = text.lower().strip()
    out = np.zeros(NUM_FEATURES, dtype=np.float32)
    for i, kw in enumerate(KEYWORDS):
        if kw in t or kw in text:
            out[i] = 1.0
    return out


def build_synthetic_data():
    """构造简单训练数据。"""
    X, Y = [], []
    # greet
    for s in ["你好", "hello", "hi", "嗨", "你好呀", "早上好"]:
        X.append(text_to_features(s))
        Y.append(0)
    # math
    for s in ["数学题", "算式", "计算", "加减法", "应用题", "数学怎么学"]:
        X.append(text_to_features(s))
        Y.append(1)
    # thanks
    for s in ["谢谢", "感谢", "多谢", "谢谢老师", "不客气"]:
        X.append(text_to_features(s))
        Y.append(2)
    # other
    for s in ["总结一下", "概括", "讲解", "练习", "设置", "随便说点什么"]:
        X.append(text_to_features(s))
        Y.append(3)
    return np.array(X, dtype=np.float32), np.array(Y, dtype=np.int32)


def main():
    X, y = build_synthetic_data()
    y_onehot = tf.keras.utils.to_categorical(y, NUM_CLASSES)

    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(NUM_FEATURES,)),
        tf.keras.layers.Dense(16, activation="relu"),
        tf.keras.layers.Dense(NUM_CLASSES, activation="softmax"),
    ])
    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
    model.fit(X, y_onehot, epochs=80, verbose=0)

    # 导出 TFLite
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    tflite_model = converter.convert()

    out_dir = os.path.join(os.path.dirname(__file__), "..", "android", "app", "src", "main", "assets")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "intent_classifier.tflite")
    with open(out_path, "wb") as f:
        f.write(tflite_model)
    print("已导出:", out_path)


if __name__ == "__main__":
    main()
