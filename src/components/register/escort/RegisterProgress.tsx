import { Check, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StepItem {
  number: number;
  title: string;
  icon: LucideIcon;
}

interface RegisterProgressProps {
  currentStep: number;
  steps: StepItem[];
}

export const RegisterProgress = ({ currentStep, steps }: RegisterProgressProps) => {
  return (
    <>
      {/* Progress Steps - Desktop */}
      <Card className="card-premium mb-6 hidden md:block">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${isCurrent ? 'bg-primary text-white scale-110' : ''}
                      ${!isCompleted && !isCurrent ? 'bg-muted text-muted-foreground' : ''}
                    `}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs mt-1 ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded-full transition-colors ${currentStep > step.number ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps - Mobile */}
      <Card className="card-premium mb-6 md:hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2">
            {steps.map((step) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div
                  key={step.number}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${isCurrent ? 'bg-primary text-white' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-muted text-muted-foreground' : ''}
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
