type JSONPrimitive = string | number | boolean | null;
type JSONArray = JSONSerializable[];
type JSONObject = { [key: string]: JSONSerializable };

export type JSONSerializable = JSONPrimitive | JSONArray | JSONObject;
