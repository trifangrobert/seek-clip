from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor, Wav2Vec2ProcessorWithLM, pipeline

asr_repos = {
    "base-960h": "facebook/wav2vec2-base-960h",
    "minilibrispeech": "3funnn/wav2vec2-base-minilibrispeech",
    "common-voice": "3funnn/wav2vec2-base-common-voice",
    "jonatasgrosman": "jonatasgrosman/wav2vec2-large-xlsr-53-english"
}

lm_boosted_repos = {
    "minilibrispeech": "3funnn/wav2vec2-base-minilibrispeech-lm",
    "common-voice": "3funnn/wav2vec2-base-common-voice-lm",
}

def init_model(asr_repo, boost_lm):
    asr = Wav2Vec2ForCTC.from_pretrained(asr_repos[asr_repo])
    if boost_lm:
        processor = Wav2Vec2ProcessorWithLM.from_pretrained(lm_boosted_repos[asr_repo])
    else:
        processor = Wav2Vec2Processor.from_pretrained(asr_repos[asr_repo])
        
    fix_spelling = pipeline("text2text-generation", model="oliverguhr/spelling-correction-english-base")
    return asr, processor, fix_spelling
