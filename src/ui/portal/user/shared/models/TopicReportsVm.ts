import { JsonObj } from "~/core/types/Json";
import { AvatarColor } from "~/domain/common/models/AvatarColor";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { TopicReportItem, TopicReportsRes } from "~/domain/lms/models/TopicsReportModels";

export class TopicReportsVm {
    pageInfo: PageInfo;
    items: TopicReportItemVm[];

    constructor({
        pageInfo,
        items
    }: {
        pageInfo: PageInfo;
        items: TopicReportItemVm[];
    }) {
        this.pageInfo = pageInfo;
        this.items = items;
    }

    static fromJson(json: JsonObj): TopicReportsVm {
        const pageInfo = PageInfo.fromJson(json.pageInfo as JsonObj);
        const items = (json.items as JsonObj[]).map(itemJson => TopicReportItemVm.fromJson(itemJson));
        return new TopicReportsVm({ pageInfo, items });
    }

    static fromDomain(domain: TopicReportsRes): TopicReportsVm {
        if(true) {
            return this.dummyData();
        }
        const pageInfo = domain.pageInfo;
        const items = domain.items.map(item => TopicReportItemVm.fromDomain(item));
        return new TopicReportsVm({ pageInfo, items });
    }

    static dummyData(): TopicReportsVm {
        const mathTopics = [
            { name: "Algebra", color: "#e74c3c", assessments: 15, surveys: 8, completedA: 12, completedS: 6, avg: 78 },
            { name: "Geometry", color: "#3498db", assessments: 18, surveys: 10, completedA: 14, completedS: 8, avg: 85 },
            { name: "Calculus", color: "#2ecc71", assessments: 20, surveys: 12, completedA: 16, completedS: 9, avg: 72 },
            { name: "Probability & Statistics", color: "#f39c12", assessments: 14, surveys: 9, completedA: 11, completedS: 7, avg: 91 },
            { name: "Trigonometry", color: "#9b59b6", assessments: 16, surveys: 11, completedA: 13, completedS: 8, avg: 67 },
            { name: "Linear Algebra", color: "#1abc9c", assessments: 12, surveys: 7, completedA: 9, completedS: 5, avg: 82 },
            { name: "Differential Equations", color: "#e67e22", assessments: 22, surveys: 13, completedA: 18, completedS: 10, avg: 76 },
        ];
        const items: TopicReportItemVm[] = mathTopics.map((topic, i) => {
            const base = new TopicReportItem({
                id: i + 1,
                name: topic.name,
                avatarColor: new AvatarColor({
                    bgColor: topic.color,
                    fgColor: '#ffffff'
                }),
                totalAssessments: topic.assessments,
                totalSurveys: topic.surveys,
                completedAssessments: topic.completedA,
                completedSurveys: topic.completedS,
                averagePercentage: topic.avg,
            });
            return new TopicReportItemVm({ base });
        });
        const pageInfo = new PageInfo({
            pageSize: 12,
            page: 1,
            totalItems: 12,
            totalPages: 1,
        });
        return new TopicReportsVm({ pageInfo, items });
    }

}

export class TopicReportItemVm {
    base: TopicReportItem;

    constructor({ base }: { base: TopicReportItem }) {
        this.base = base;
    }

    static fromJson(json: JsonObj): TopicReportItemVm {
        const base = TopicReportItem.fromJson(json);
        return new TopicReportItemVm({ base });
    }

    static fromDomain(domain: TopicReportItem): TopicReportItemVm {
        return new TopicReportItemVm({ base: domain });
    }
    
}