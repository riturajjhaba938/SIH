import os

PERSIST_DIRECTORY = os.getenv("CHROMADB_PERSIST_DIRECTORY", "./chroma_db")
os.makedirs(PERSIST_DIRECTORY, exist_ok=True)

try:
    import chromadb
    from chromadb.config import Settings
    chroma_client = chromadb.PersistentClient(path=PERSIST_DIRECTORY, settings=Settings(anonymized_telemetry=False))
except ImportError:
    chroma_client = None

def get_nsqf_collection():
    if chroma_client:
        return chroma_client.get_or_create_collection(name="nsqf_packs")
    return None

def query_recommendations(profile_text: str, n_results: int = 3):
    collection = get_nsqf_collection()
    if collection:
        return collection.query(
            query_texts=[profile_text],
            n_results=n_results
        )
    return {'metadatas': []}

