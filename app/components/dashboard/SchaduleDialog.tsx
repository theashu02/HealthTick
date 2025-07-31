import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hook/user-auth";
import { scheduleMeeting } from "@/hook/action";
import type { Contact } from "@/lib/types";
import { Loader2, User, Phone } from "lucide-react";
// Removed framer-motion and AnimatePresence imports

interface ScheduleDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedDate: Date;
  selectedTime: string;
}

const formSchema = z.object({
  clientName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  clientPhone: z
    .string()
    .min(10, { message: "Please enter a valid phone number." }),
  //   duration: z.enum(['20', '40'], { required_error: 'You need to select a duration.' }),
  duration: z.enum(["20", "40"], "You need to select a duration."),
});

export function ScheduleDialog({
  isOpen,
  setIsOpen,
  selectedDate,
  selectedTime,
}: ScheduleDialogProps) {
  //   const { toast } = useToast();
  const { accessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientPhone: "",
      duration: "20",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted!", values);
    if (!accessToken) {
      //   toast({ variant: 'destructive', title: 'Authentication Error', description: 'Could not verify user.' });
      return;
    }
    setIsSubmitting(true);
    const meetingData = {
      ...values,
      duration: parseInt(values.duration, 10) as 20 | 40,
      date: selectedDate.toISOString(),
      time: selectedTime,
    };

    const result = await scheduleMeeting(meetingData, accessToken);

    if (result.success) {
      //   toast({ title: 'Success!', description: 'Your meeting has been scheduled.' });
      setIsOpen(false);
    } else {
      //   toast({ variant: 'destructive', title: 'Oh no! Something went wrong.', description: result.error });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            Schedule a New Meeting
          </DialogTitle>
          <DialogDescription>
            For {selectedDate.toLocaleDateString()} at {selectedTime}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="20" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          20 minutes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="40" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          40 minutes
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative">
              <FormLabel>Client Details</FormLabel>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter client name"
                  {...form.register("clientName")}
                  className="pl-9"
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => <Input type="hidden" {...field} />}
            />

            <FormField
              control={form.control}
              name="clientPhone"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="Client Phone"
                        {...field}
                        className="pl-9"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Schedule Meeting
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
