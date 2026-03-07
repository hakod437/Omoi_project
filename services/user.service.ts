import { calculateCompatibility } from '@/lib/scoring';
import { ServiceResponse } from '@/types/service';

export class UserService {
    static async searchUsers(query: string, excludeUserId?: string): Promise<ServiceResponse<any[]>> {
        void query
        void excludeUserId
        return { success: true, data: [] }
    }

    static async compareUsers(userAId: string, userBId: string): Promise<ServiceResponse<any>> {
        void userAId
        void userBId
        void calculateCompatibility
        return { success: false, error: 'Backend disabled (frontend-only mode)' }
    }
}
