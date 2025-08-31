import React from 'react';
import { Badge } from '~/ui/widgets/badges/Badge';

interface QuestionTypeBadgeProps {
    type: string;
}

export const QuestionTypeBadge: React.FC<QuestionTypeBadgeProps> = ({ type }) => {
    return <Badge color='indigo'>{type}</Badge>
};

interface MarksBadgeProps {
    text: string;
}

export const MarksBadge: React.FC<MarksBadgeProps> = ({ text }) => {
    return <Badge color='emerald'>{text}</Badge>;
}

interface LevelBadgeProps {
    text: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ text }) => {
    return <Badge color='indigo'>{text}</Badge>;
}
