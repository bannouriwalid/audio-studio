import React from "react";
import "../styles/components/VoiceCard.css";

interface VoiceCardProps {
    name: string;
    tags: string[];
    audioSrc: string;
    tagDescriptions?: Record<string, string>; // <-- optional mapping
}

const VoiceCard: React.FC<VoiceCardProps> = ({ name, tags, audioSrc, tagDescriptions = {} }) => {
    return (
        <div className="vc-card">
            <div className="vc-ups">
                <div className="screw1">+</div>
                <div className="screw2">+</div>
            </div>
            <div className="vc-wrapper">
                <p className="vc-title-1">{name}</p>
                <div className="vc-title-3">
                    {tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className={`vc-tag tag-${tag.toLowerCase()}`}
                            title={tagDescriptions[tag] || ""}
                        >
                        {tag}
                    </span>
                    ))}
                </div>
                <audio controls src={audioSrc} className="vc-audio"/>
            </div>
            <div className="vc-card1 mb-3">
                <div className="vc-line1"></div>
                <div className="vc-line2"></div>
                <div className="vc-yl">
                    <div className="vc-roll">
                        <div className="vc-s_wheel"></div>
                        <div className="vc-tape"></div>
                        <div className="vc-e_wheel"></div>
                    </div>
                    <p className="vc-num">90</p>
                </div>
                <div className="vc-or">
                    <p className="vc-time">2×30min</p>
                </div>
            </div>
            <div className="vc-downs">
                <div className="screw3">+</div>
                <div className="screw4">+</div>
            </div>
        </div>
    );
};

export default VoiceCard;
