import SubNav from "../../components/SubNav.tsx";
import {useEffect, useState} from "react";
import "../../styles/textToSpeech/SpeakersCatalogue.css";
import {fetchSpeakers} from "../../api/textToSpeechApi.ts";
import VoiceCard from "../../components/VoiceCard.tsx";


const buttonLinks = [
    { path: "/about-tts-models", line1: "Learn more about", line2: "the Models" },
    { path: "/tts", line1: "Try the", line2: "TTS Generator" },
    { path: "/available-speakers", line1: "Explore", line2: "Speakers" },
];

interface Voice {
    name: string;
    tags: string[];
}

// eslint-disable-next-line react-refresh/only-export-components
export const sanitizeFilename = (name: string): string => {
    return name
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_");
};


const SpeakersView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [voices, setVoices] = useState<Voice[]>([]);
    const [filteredVoices, setFilteredVoices] = useState<Voice[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("");

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentVoices = filteredVoices.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredVoices.length / itemsPerPage);

    useEffect(() => {
        fetchSpeakers().then((data) => {
            console.log(data)
            setVoices(data);
            setFilteredVoices(data);
        });
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();

        const filtered = voices.filter((voice) => {
            const matchName = voice.name.toLowerCase().includes(term);
            const matchTag =
                selectedTag === "" || voice.tags.includes(selectedTag.toLowerCase());
            return matchName && matchTag;
        });

        setFilteredVoices(filtered);
    }, [searchTerm, selectedTag, voices]);

    const tagFilters = [
        { tag: "male", description: "Identifies the voice as masculine." },
        { tag: "female", description: "Identifies the voice as feminine." },
        { tag: "child", description: "Young-sounding, playful or high-pitched voice." },
        { tag: "young", description: "Teenage to early adult tone, energetic." },
        { tag: "old", description: "Elderly or mature voice, deeper or more textured." },
        { tag: "soft", description: "Calm, gentle, and smooth delivery." },
        { tag: "energetic", description: "High energy, enthusiastic, and expressive." }
    ];    return (
            <div className="container">
            <SubNav buttons={buttonLinks}/>
                <h1>Voices Catalogue</h1>
                <div className="filter-bar">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>

                    <div className="tag-buttons">
                        <button
                            className={selectedTag === "" ? "active" : ""}
                            onClick={() => setSelectedTag("")}
                        >
                            All
                        </button>
                        {tagFilters.map(({tag, description}) => (
                            <button
                                key={tag}
                                title={description} // Tooltip on hover
                                className={selectedTag === tag ? "active" : ""}
                                onClick={() => setSelectedTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="voice-grid">
                    {currentVoices.map((voice) => (
                        <VoiceCard
                            key={voice.name}
                            name={voice.name}
                            tags={voice.tags}
                            tagDescriptions={Object.fromEntries(tagFilters.map(t => [t.tag, t.description]))}
                            audioSrc={`/voices/${sanitizeFilename(voice.name)}.wav`}
                        />
                    ))}
                </div>
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            className={currentPage === i + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
        </div>

    );
};

export default SpeakersView;