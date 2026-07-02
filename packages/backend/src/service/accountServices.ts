import { AppDataSource } from '../db/data-source.js';
import { Account } from '../entities/Account.js';
import bcrypt from 'bcrypt';
import { User } from '../entities/User.js';
import { Role } from '../entities/Role.js';
export class AccountService {
    private accountRepo = AppDataSource.getRepository(Account);
    private roleRepo = AppDataSource.getRepository(Role);
    async getAllAccounts() {
        const accounts = await this.accountRepo.find({
            where: { isDeleted: false },
            relations: {
                role: true,
                user: { team: true },
            },
            select: {
                accId: true,
                username: true,
                createdAt: true,
                role: { roleName: true },
                user: {
                    userId: true,
                    fullName: true,
                    email: true,
                    avatarUrl: true,
                    team: {
                        teamId: true,
                        teamName: true,
                    },
                },
            }
        });
        return accounts.map(acc => {
            const formattedDate = acc.createdAt
                ? new Date(acc.createdAt).toISOString().replace('T', ' ').split('.')[0]
                : null;
            return {
        
                accId: acc.accId,
                username: acc.username,
                createdAt: formattedDate,
                roleName: acc.role?.roleName,
                userId: acc.user?.userId ?? null,
                fullName: acc.user?.fullName ?? null,
                email: acc.user?.email ?? null,
                avatarUrl: acc.user?.avatarUrl ?? null,
                teamId: acc.user?.team?.teamId ?? null,
                teamName: acc.user?.team?.teamName ?? null
            }
        });
}
    
    async getAccountInfo(id: number) {
        const account = await this.accountRepo.findOne({
            where: { 
                accId: id, 
                isDeleted: false 
            },
        });

        if (!account) {
            throw new Error('Account not found or has been deleted');
        }

        return account;
    }

    async createAccount(data: any) {
        return await AppDataSource.transaction(async (transactionalEntityManager) => {
            const accountRepo = transactionalEntityManager.getRepository(Account);
            const roleRepo = transactionalEntityManager.getRepository(Role);
            const userRepo = transactionalEntityManager.getRepository(User);

            //Check if username already exists
            const existing = await accountRepo.findOne({ where: { username: data.username } });

            if (existing) throw new Error('Username already exists');

            const hashedPassword = await bcrypt.hash(data.password, 10);
            const role = await roleRepo.findOne({ where: { roleName: data.role } });
            if (!role) throw new Error('Role not found');

            const account = accountRepo.create({
                username: data.username,
                password: hashedPassword,
                roleId: role.roleId,
                createdAt: new Date().toISOString(),
                isDeleted: false
            });

            let savedAccount;
            try {
                savedAccount = await accountRepo.save(account);
            } catch (error: any) {
                const message = String(error?.message ?? '');
                if (error?.code === 'SQLITE_CONSTRAINT' || error?.code === '23505' || message.includes('UNIQUE constraint failed')) {
                    throw new Error('Username already exists');
                }
                throw error;
            }

            const user = userRepo.create({
                fullName: data.fullname,
                mssv: data.mssv,
                class: data.class,
                email: data.email,
                phoneNumber: data.phoneNumber,
                account: savedAccount,
                isDeleted: 0
            });

            return await userRepo.save(user);
        });
    }

    async updateAccount(id: number, data: any) {
    const account = await this.accountRepo.findOne({
        where: { accId: id },
        relations: { role: true }
    });

    if (!account) throw new Error('Account not found');

    if (data.password) {
        account.password = await bcrypt.hash(data.password, 10);
    }

    if (data.roleId) {
        const role = await this.roleRepo.findOneBy({ roleName: data.roleId });
        if (!role) throw new Error(`Role not found`);
        account.role = role;
    }
        account.updatedAt = new Date().toISOString().replace('T', ' ').split('.')[0];
    const savedAccount = await this.accountRepo.save(account);

    return {
        accId: savedAccount.accId,
        username: savedAccount.username,
        createdAt: savedAccount.createdAt,
        updatedAt: savedAccount.updatedAt,
        roleName: savedAccount.role?.roleName
    };
}

    async softDeleteAccount(id: number) {
        const account = await this.accountRepo.findOneBy({ accId: id });
        if (!account) throw new Error('Account not found');

        account.isDeleted = true; 
        return await this.accountRepo.save(account);
    }
}