
import { prisma } from './lib/prisma';

async function main() {
    const testPhone = '0123456789';
    const testUsername = 'testuser';

    try {
        const deleted = await prisma.user.deleteMany({
            where: {
                OR: [
                    { phoneNumber: testPhone },
                    { username: testUsername }
                ]
            }
        });
        console.log(`Deleted ${deleted.count} test users.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
