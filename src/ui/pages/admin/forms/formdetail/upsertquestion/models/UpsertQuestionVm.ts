import { UpsertQuestionStore } from "../UpsertQuestionStore";
import { QuestionType } from "~/domain/forms/models/question/QuestionType";
import { FValue } from "~/ui/widgets/form/FValue";
import { action, computed, makeObservable, observable } from "mobx";
import { createRef } from "react";
import { Bool3 } from "~/core/utils/Bool3";
import { QuestionLevel } from "~/domain/forms/models/question/QuestionLevel";
import { QuestionOptions } from "../ena/QuestionOptions";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { EnAVm } from "../ena/EnAVm";
import { ThingId } from "~/core/utils/ThingId";
import { QMediaTile } from "~/domain/forms/models/qmedia/QMediaTile";
import { FormsComposerEditorRef } from "~/ui/components/formscomposer/FormsComposerEditor";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { blockSchema } from "~/ui/components/formscomposer/core/schema";

export type UpsertQuestionVmProps = {
  id: number | null;
  storeRef: UpsertQuestionStore;
  type: FValue<QuestionType | null>;
  questionNode: ProseMirrorNode | null;
  enaVm: EnAVm | null;
  questionOptions: QuestionOptions | null;
  scorable: FValue<Bool3>;
  level: FValue<QuestionLevel | null>;
  marks: FValue<string>;
  ansHintNode: ProseMirrorNode | null;
  ansExplanationNode: ProseMirrorNode | null;
  isRequired: FValue<Bool3>;
  mediaFiles?: QMediaTile[];
}


export class UpsertQuestionVm {

  readonly instanceId = ThingId.generate();
  readonly id: number | null;
  readonly storeRef: UpsertQuestionStore;
  readonly type: FValue<QuestionType | null>;
  questionTextRef: React.RefObject<FormsComposerEditorRef | null>;
  questionNode: ProseMirrorNode | null = null;
  questionOptionsVm: QuestionOptions | null;
  enaVm: EnAVm | null;
  scorable: FValue<Bool3>;
  level: FValue<QuestionLevel | null>;
  marks: FValue<string>;
  ansHintRef: React.RefObject<FormsComposerEditorRef | null>;
  ansHintNode: ProseMirrorNode | null = null;
  ansExplanationRef: React.RefObject<FormsComposerEditorRef | null>;
  ansExplanationNode: ProseMirrorNode | null = null;
  isRequired: FValue<Bool3>;
  mediaFiles: QMediaTile[] = [];

  constructor(props: UpsertQuestionVmProps) {
    this.id = props.id;
    this.storeRef = props.storeRef;
    this.type = props.type;
    this.questionTextRef = createRef<FormsComposerEditorRef>();
    this.questionNode = props.questionNode;
    this.questionOptionsVm = props.questionOptions;
    this.enaVm = props.enaVm || null;
    this.scorable = props.scorable;
    this.level = props.level;
    this.marks = props.marks;
    this.ansHintRef = createRef<FormsComposerEditorRef>();
    this.ansHintNode = props.ansHintNode;
    this.ansExplanationRef = createRef<FormsComposerEditorRef>();
    this.ansExplanationNode = props.ansExplanationNode;
    this.isRequired = props.isRequired;
    this.mediaFiles = props.mediaFiles || [];

    makeObservable(this, {
      questionTextRef: observable.ref,
      onQuestionNodeChange: action,
      questionNode: observable.ref,
      showScorable: computed,
      mediaFiles: observable.shallow,
      addMediaFile: action,
      removeMediaFile: action,
    });
  }


  get formDetail() {
    return this.storeRef.formStore.fd;
  }

  get isMathOrScience(): boolean {
    return this.formDetail.assmntDomain?.isMathOrScience ?? false;
  }


  get showScorable(): boolean {
    if (!this.storeRef.formType.isAssessment) {
      return false;
    }
    return this.type.value!.assmntMarksPolicy.isOptional;
  }

  onChangeScorable(v: boolean): void {
    this.scorable.set(Bool3.fromBool(v));
    if (this.marks.value === "") {
      this.marks.set("1");
    }
    if (this.level.value === null) {
      this.level.set(QuestionLevel.medium);
    }
  }

  onChangeLevel(v: QuestionLevel | null): void {
    this.level.set(v);
  }

  onRequiredChange(value: boolean): void {
    this.isRequired.set(Bool3.fromBool(value));
  }

  onQuestionNodeChange(node: ProseMirrorNode | null): void {
    this.questionNode = node;
  }

  addQuestionNodeListener(): void {
    const editor = this.questionTextRef.current;
    if (!editor) {
      throw new Error("Editor reference is not set");
    }
    editor.addChangeListener(this.onQuestionNodeChange.bind(this));
  }

  removeQuestionNodeListener(): void {
    const editor = this.questionTextRef.current;
    if (editor) {
      editor.removeChangeListener(this.onQuestionNodeChange.bind(this));
    }
  }

  getQuestionText(): string {
    return FormsComposerUtil.toTextFromRefOrEmpty({ ref: this.questionTextRef, schema: blockSchema });
  }

  onAnsExplanationNodeChange(node: ProseMirrorNode | null) {
    this.ansExplanationNode = node;
  }

  onAnsHintNodeChange(node: ProseMirrorNode | null) {
    this.ansHintNode = node;
  }

  addMediaFile(file: QMediaTile): void {
    if (!this.mediaFiles.some(f => f.id === file.id)) {
      this.mediaFiles.push(file);
    }
  }

  removeMediaFile(file: QMediaTile): void {
    const index = this.mediaFiles.findIndex(f => f.id === file.id);
    if (index !== -1) {
      this.mediaFiles.splice(index, 1);
    }
  }

}