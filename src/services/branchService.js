import { supabase } from '../lib/supabase.js'
import localBranches from '../data/branches.js'

// Merges a branch's default (local) data with an admin-set location
// override from Supabase, if one exists. Until an admin sets a location,
// the branch keeps showing its default location from data/branches.js.
function mergeBranch(localBranch, override) {
  const location =
    override?.location?.trim() ||
    localBranch.location

  return {
    ...localBranch,
    location,
    mapQuery: location,
  }
}

export async function getBranches() {
  try {
    const { data, error } = await supabase
      .from('branches')
      .select('id, location')

    if (error) throw error

    const overrides = new Map(
      (data ?? []).map((row) => [row.id, row]),
    )

    return localBranches.map((branch) =>
      mergeBranch(branch, overrides.get(branch.id)),
    )
  } catch (err) {
    // No `branches` table yet, offline, or RLS not set up —
    // fall back to the default local data so the site still works.
    console.warn(
      'Falling back to default branch locations:',
      err?.message || err,
    )
    return localBranches
  }
}

export async function getBranchById(branchId) {
  const branches = await getBranches()
  return branches.find((branch) => branch.id === branchId)
}

export function getLocalBranchFallback(branchId) {
  return localBranches.find((branch) => branch.id === branchId)
}
