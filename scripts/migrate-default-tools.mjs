import PocketBase from 'pocketbase'

const SYSTEM_OWNER = '__tool_parking_defaults__'
const apply = process.argv.includes('--apply')
const pb = new PocketBase(process.env.POCKETBASE_URL)
pb.autoCancellation(false)

if (!process.env.POCKETBASE_URL || !process.env.POCKETBASE_ADMIN_EMAIL || !process.env.POCKETBASE_ADMIN_PASSWORD) {
  throw new Error('PocketBase environment variables are required')
}

await pb.collection('_superusers').authWithPassword(
  process.env.POCKETBASE_ADMIN_EMAIL,
  process.env.POCKETBASE_ADMIN_PASSWORD
)

const byCreated = (a, b) => String(a.created).localeCompare(String(b.created))
const tools = (await pb.collection('tools').getFullList()).sort(byCreated)
const stackItems = (await pb.collection('stack_items').getFullList()).sort(byCreated)
const defaults = tools.filter((tool) => tool.isDefault)
const defaultGroups = new Map()

for (const tool of defaults) {
  const key = tool.name.trim().toLowerCase().replace(/\s+/g, ' ')
  const group = defaultGroups.get(key) ?? []
  group.push(tool)
  defaultGroups.set(key, group)
}

const replacements = new Map()
const canonicalDefaults = []
for (const group of defaultGroups.values()) {
  const canonical = group.find((tool) => tool.userId === SYSTEM_OWNER) ?? group[0]
  canonicalDefaults.push(canonical)
  for (const duplicate of group) {
    if (duplicate.id !== canonical.id) replacements.set(duplicate.id, canonical.id)
  }
}

const projectedTools = tools
  .filter((tool) => !replacements.has(tool.id))
  .map((tool) => canonicalDefaults.some((canonical) => canonical.id === tool.id)
    ? { ...tool, userId: SYSTEM_OWNER }
    : tool)
const ownerNames = new Set()
for (const tool of projectedTools) {
  const key = `${tool.userId}|${tool.name.trim().toLowerCase().replace(/\s+/g, ' ')}`
  if (ownerNames.has(key)) throw new Error(`Cannot add tool uniqueness index; duplicate remains: ${tool.name}`)
  ownerNames.add(key)
}

const seenPlacements = new Set()
const stackUpdates = []
const stackDeletes = []
for (const item of stackItems) {
  const toolId = replacements.get(item.toolId) ?? item.toolId
  const key = `${item.projectId}|${toolId}`
  if (seenPlacements.has(key)) stackDeletes.push(item)
  else {
    seenPlacements.add(key)
    if (toolId !== item.toolId) stackUpdates.push({ item, toolId })
  }
}

const summary = {
  mode: apply ? 'apply' : 'dry-run',
  defaultsBefore: defaults.length,
  canonicalDefaults: canonicalDefaults.length,
  stackReferencesToRemap: stackUpdates.length,
  redundantStackItems: stackDeletes.length,
  redundantDefaults: replacements.size,
}
console.log(JSON.stringify(summary, null, 2))

if (!apply) process.exit(0)

for (const canonical of canonicalDefaults) {
  await pb.collection('tools').update(canonical.id, {
    userId: SYSTEM_OWNER,
    isPublic: true,
    isDefault: true,
  })
}
for (const { item, toolId } of stackUpdates) {
  await pb.collection('stack_items').update(item.id, { toolId })
}
for (const item of stackDeletes) await pb.collection('stack_items').delete(item.id)
for (const toolId of replacements.keys()) await pb.collection('tools').delete(toolId)

for (const [collectionName, index] of [
  ['tools', 'CREATE UNIQUE INDEX idx_tools_user_name ON tools (userId, name COLLATE NOCASE)'],
  ['stack_items', 'CREATE UNIQUE INDEX idx_stack_project_tool ON stack_items (projectId, toolId)'],
]) {
  const collection = await pb.collections.getOne(collectionName)
  const indexes = collection.indexes ?? []
  if (!indexes.includes(index)) await pb.collections.update(collection.id, { indexes: [...indexes, index] })
}

console.log('Migration complete')
