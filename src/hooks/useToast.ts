
// This is a simple re-export to make the toast hook available
import { useToast as useToastInternal, toast } from "@/components/ui/toast";

export const useToast = useToastInternal;
export { toast };
