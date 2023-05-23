import { z } from "zod";
import { Pot, User, sequelize } from "../model";
import { parseJSONRequest } from "../schema";

export async function GET() {
  const pots = await Pot.findAll({
    include: User,
  });
  return new Response(JSON.stringify(pots));
}

const postSchema = z.object({
  // 锅哪
  location: z.string(),
  // 几点
  time: z.string(),
  // 口味
  flavor: z.string(),
  // 备注
  remarks: z.string().optional(),
});

export async function POST(request: Request) {
  const validated = await parseJSONRequest(request, postSchema);
  if (validated.error) return validated.error;
  const data = validated.success;

  await sequelize.transaction(async (transaction) => {
    const pot = await Pot.create(data, { transaction });
    return pot;
  });

  return new Response("OK");
}

const putSchema = z.object({
  id: z.number(),
  // 锅哪
  location: z.string().optional(),
  // 几点
  time: z.string().optional(),
  // 口味
  flavor: z.string().optional(),
  // 备注
  remarks: z.string().optional(),
});

export async function PUT(request: Request) {
  const validated = await parseJSONRequest(request, putSchema);
  if (validated.error) return validated.error;
  const data = validated.success;

  const pot = await Pot.findByPk(data.id);
  if (!pot) return new Response("Not found", { status: 404 });

  await sequelize.transaction(async (transaction) => {
    await pot.update(data, { transaction });
    return pot;
  });

  return new Response("OK");
}

const deleteSchema = z.object({
  id: z.number(),
});

export async function DELETE(request: Request) {
  const validated = await parseJSONRequest(request, deleteSchema);
  if (validated.error) return validated.error;
  const data = validated.success;

  const pot = await Pot.findByPk(data.id);
  if (!pot) return new Response("Not found", { status: 404 });

  await sequelize.transaction(async (transaction) => {
    await pot.destroy({ transaction });
    return pot;
  });

  return new Response("OK");
}
