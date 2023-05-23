import {
  UnknownKeysParam,
  ZodRawShape,
  ZodTypeAny,
  objectInputType,
  objectOutputType,
  z,
} from "zod";

export async function parseJSONRequest<
  T extends ZodRawShape,
  UnknownKeys extends UnknownKeysParam,
  Catchall extends ZodTypeAny,
  Output = objectOutputType<T, Catchall, UnknownKeys>,
  Input = objectInputType<T, Catchall, UnknownKeys>
>(
  request: Request,
  schema: z.ZodObject<T, UnknownKeys, Catchall, Output, Input>
) {
  try {
    const data = await request.json();
    const validated = await schema.safeParseAsync(data);
    if (!validated.success) {
      return {
        error: new Response(validated.error.format()._errors.join("\n"), {
          status: 400,
        }),
      };
    }
    return { success: validated.data };
  } catch (e) {
    return { error: new Response("Bad request", { status: 400 }) };
  }
}
