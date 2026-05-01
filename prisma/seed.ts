// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@localrankers.com";
    const password = "Admin@SecurePass123";

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log("✅ Admin already exists:", email);
        return;
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
        data: { email, password: hashed, role: "ADMIN" },
    });

    console.log("✅ Admin account created!");
    console.log("─────────────────────────────");
    console.log("URL:      /control-panel/login");
    console.log("Email:    " + email);
    console.log("Password: " + password);
    console.log("─────────────────────────────");
    console.log("⚠️  Change your password after first login!");
}

main().catch(console.error).finally(() => prisma.$disconnect());