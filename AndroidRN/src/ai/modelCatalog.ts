export type LLMModelMeta = {
  id: string;
  name: string;
  family: 'qwen';
  sizeHint: string;
  sourceUrl: string;
  /** 推荐随应用打包到 assets 的默认本地模型 */
  recommendedLocal?: boolean;
};

const GITEE_QWEN122 = 'https://gitee.com/hf-models/Qwen3.5-122B-A10B-GGUF/raw/main';

/** 预置 GGUF 模型：全部来自 Gitee Qwen3.5-122B-A10B-GGUF 仓库 */
export const LLM_MODELS: LLMModelMeta[] = [
  {
    id: 'qwen3.5-122b-ud-iq3_xxs',
    name: 'Qwen3.5-122B-A10B UD-IQ3_XXS（推荐本地）',
    family: 'qwen',
    sizeHint: '约 15GB+（高端设备）',
    sourceUrl: `${GITEE_QWEN122}/Qwen3.5-122B-A10B-UD-IQ3_XXS.gguf`,
    recommendedLocal: true,
  },
  {
    id: 'qwen3.5-122b-ud-iq3_s',
    name: 'Qwen3.5-122B-A10B UD-IQ3_S',
    family: 'qwen',
    sizeHint: '约 15GB+（高端设备）',
    sourceUrl: `${GITEE_QWEN122}/Qwen3.5-122B-A10B-UD-IQ3_S.gguf`,
  },
  {
    id: 'qwen3.5-122b-ud-iq1_s',
    name: 'Qwen3.5-122B-A10B UD-IQ1_S',
    family: 'qwen',
    sizeHint: '约 15GB+（高端设备）',
    sourceUrl: `${GITEE_QWEN122}/Qwen3.5-122B-A10B-UD-IQ1_S.gguf`,
  },
  {
    id: 'qwen3.5-122b-ud-iq1_m',
    name: 'Qwen3.5-122B-A10B UD-IQ1_M',
    family: 'qwen',
    sizeHint: '约 15GB+（高端设备）',
    sourceUrl: `${GITEE_QWEN122}/Qwen3.5-122B-A10B-UD-IQ1_M.gguf`,
  },
  {
    id: 'qwen3.5-122b-ud-iq2_xxs',
    name: 'Qwen3.5-122B-A10B UD-IQ2_XXS',
    family: 'qwen',
    sizeHint: '约 15GB+（高端设备）',
    sourceUrl: `${GITEE_QWEN122}/Qwen3.5-122B-A10B-UD-IQ2_XXS.gguf`,
  },
  {
    id: 'qwen3.5-122b-ud-iq2_m',
    name: 'Qwen3.5-122B-A10B UD-IQ2_M',
    family: 'qwen',
    sizeHint: '约 15GB+（高端设备）',
    sourceUrl: `${GITEE_QWEN122}/Qwen3.5-122B-A10B-UD-IQ2_M.gguf`,
  },
];

