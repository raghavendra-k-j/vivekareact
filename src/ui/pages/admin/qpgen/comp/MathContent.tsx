import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import { renderMath } from '../utils/renderMath';

interface MathContentProps {
    content: string;
    className?: string;
}

const MathContent: React.FC<MathContentProps> = ({ content, className }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const processed = content.trim().replace(/\n/g, '<br>');
            contentRef.current.innerHTML = renderMath(processed);
        }
    }, [content]);

    return <div ref={contentRef} className={className} />;
};

export default MathContent;


