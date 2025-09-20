import { File, Upload, X } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { Button } from "~/ui/widgets/button/Button";
import { IconButton } from "~/ui/widgets/button/IconButton";
import { PipelineStep } from "../models/UploadFileStep";
import { useQPGenPageStore } from "../QPGenPageContext";


export function FileUploadView() {
  const store = useQPGenPageStore();
  return (<Observer>
    {() => {
      if (store.inputStore.fileSource.hasFile) {
        return <ExtractionPreview />;
      }
      else {
        const pipeline = store.inputStore.filePipeline;
        return pipeline ? <PipelineStepsView /> : <FileChooserView />;
      }
    }}
  </Observer>);
}

function ExtractionPreview() {
  const store = useQPGenPageStore();
  return (<div className="px-6 flex flex-col gap-2">
    <div className="bg-surface rounded-md border border-default shadow-xs">
      <div className="text-primary px-4 font-semibold py-2 gap-2 flex items-center justify-between">
        <div>
          <File size={18} />
        </div>
        <div className="truncate max-w-full">{store.inputStore.fileSource.file!.fileName}</div>
        <IconButton
          size="sm"
          color="secondary"
          variant="ghost"
          icon={<X className="w-4 h-4" />}
          onClick={() => store.inputStore.clearFile()}
        />
      </div>
      <div className="h-48 p-4 border-t border-default overflow-y-auto text-sm text-secondary">
        {store.inputStore.fileSource.content}
      </div>
    </div>
  </div>);
}




function FileChooserView() {
  const store = useQPGenPageStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      store.inputStore.onFileSelected(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      store.inputStore.onFileSelected(file);
    }
  }, [store]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex items-center justify-center w-full px-6">
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-sm cursor-pointer transition
          hover:bg-gray-100 hover:border-secondary
          ${isDragging ? 'bg-primary-50 border-primary-500' : 'bg-surface border-default'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-3 text-secondary" />
          <p className="mb-1 text-sm text-secondary">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-secondary">(Accepted: .txt, .pdf, .docx, Max file size: 50MB)</p>
        </div>

        <input
          id="file-upload"
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}


function PipelineStepsView() {
  const store = useQPGenPageStore();
  return (
    <div className="px-6">
      <Observer>
        {() => {
          const steps = store.inputStore.filePipeline!.getAllSteps();
          const hasAnyError = steps.some(step => step.isError());
          return (
            <div className="flex flex-col bg-surface shadow-xs rounded-sm border border-default divide-y divide-default">
              {steps.map((step, index) => (
                <PipelineStepItem
                  key={index}
                  step={step}
                />
              ))}
              {hasAnyError && (
                <div className="px-4 py-3 flex justify-start items-center gap-3">
                  <Button variant="outline" color="secondary"
                    size="sm"
                    onClick={() => store.inputStore.clearFile()}
                  >
                    Clear File
                  </Button>
                </div>
              )}
            </div>
          );
        }}
      </Observer>
    </div>
  );
}





type PipelineStepItemProps = {
  step: PipelineStep;
};

export function PipelineStepItem({ step }: PipelineStepItemProps) {
  return (
    <Observer>
      {() => {
        return (<div className="flex flex-row items-center gap-3 px-4 py-3">
          <div className="w-5 h-5 shrink-0">
            {step.ui.icon}
          </div>
          <div>
            <div className="text-default text-base-m font-medium">{step.ui.label}</div>
            {step.ui.description && (
              <div className="text-sm text-secondary">{step.ui.description}</div>
            )}
          </div>
        </div>);
      }}
    </Observer>
  );
}