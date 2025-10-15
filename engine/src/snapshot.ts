import { PrismaClient } from "@prisma/client"
import { openOrders, users } from "./db";
import cron from "node-cron";

const prisma = new PrismaClient();

async function snapshot() {
    try {    
        const snapshot  = await prisma.snapshots.create({
            data : {

            }
        })
        const snapshotTime = snapshot.at;

        await prisma.openOrders.createMany({
            data : openOrders.map(o => ({
                userId: o.userId,
                orderId: o.orderId,
                asset: o.asset,
                type: o.type,
                qty: o.qty,
                leverage: o.leverage,
                amount  : o.amount,
                margin  : o.margin,
                timestamp : snapshotTime
            }))
        })

        // for balances either i can keep adding user balances again and again for each snapshot or just update the existing balances but this would be difficult to do in a single db call for each of the user so in that case we can first delete the whole db and rewrite with the existing in memory balances

// await prisma.$executeRawUnsafe(`
//   INSERT INTO "Balance" ("userId", "asset", "amount")
//   VALUES ${values}
//   ON CONFLICT ("userId", "asset")
//   DO UPDATE SET "amount" = EXCLUDED."amount"
// `);


        const values = users.map(user => {
            return `(${user.userId},${user.balance.amount},${user.balance.margin})`
        }).join(',')
        
        await prisma.$executeRawUnsafe(`
            INSERT INTO "Balances" ("userId", "amount", "margin", "locked")
            VALUES ${values}
            ON CONFLICT ("userId")
            DO UPDATE SET 
                "amount" = EXCLUDED."amount",
                "margin" = EXCLUDED."margin",   
        `)

    } catch(err) {
        return console.log(err);
    }    
}

cron.schedule("*0,30 * * * *",() => {
    snapshot()
})
