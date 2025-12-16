import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

export async function GET(req) {
  let db;
  try {
    const { searchParams } = new URL(req.url);

    const excludeId = Number(searchParams.get("exclude")); // your current user id
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(excludeId)) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    const radiusMeters = 2500;

    // Bounding box in degrees
    const latDelta = radiusMeters / 111320; // ~ meters per degree latitude
    const lngDelta = radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180));

    const minLat = lat - latDelta;
    const maxLat = lat + latDelta;
    const minLng = lng - lngDelta;
    const maxLng = lng + lngDelta;

    db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });

    // 1) Fast prefilter in SQL
    const candidates = await db.all(
      `
      SELECT user_id, username, fullname, age, sex, dog_name, dog_breed, dog_sex, photo_url, lat, lng
      FROM Users
      WHERE user_id != ?
        AND lat IS NOT NULL AND lng IS NOT NULL
        AND lat BETWEEN ? AND ?
        AND lng BETWEEN ? AND ?
      `,
      [excludeId, minLat, maxLat, minLng, maxLng]
    );

    // 2) Accurate filter in JS
    const users = candidates.filter((u) => {
      const d = haversineMeters(lat, lng, u.lat, u.lng);
      return d <= radiusMeters;
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("Error fetching nearby users:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}
