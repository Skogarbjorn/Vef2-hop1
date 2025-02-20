import { URL } from "node:url";
import { toPositiveNumberOrDefault } from "./lib.js";
import process from "node:process";

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
  BASE_URL: baseUrl = '',
} = process.env;

export function addPageMetadata(
	obj,
	path,
	{ offset = 0, limit = 10, total = 0 } = {},
) {
	if (obj._links) {
		return obj;
	}

	const offsetNum = toPositiveNumberOrDefault(offset, 0);
	const limitNum = toPositiveNumberOrDefault(limit, 10);
	const totalNum = toPositiveNumberOrDefault(total, 0);

	const newObj = { ...obj };
	console.log(newObj);

	const url = new URL(path, baseUrl || `http://${host}`);

	if (!baseUrl) {
		url.port = port;
	}

	newObj._links = {
		self: { href: `${url}?offset=${offsetNum}&limit=${limitNum}` },
	}

	if (offsetNum > 0) {
		const prevOffset = Math.max(0, offsetNum - limitNum);
		newObj._links.prev = {
			href: `${url}?offset=${prevOffset}&limit=${limitNum}`,
		}
	}

	if (offsetNum + limitNum < totalNum) {
		const nextOffset = offsetNum + limitNum;
		newObj._links.next = {
			href: `${url}?offset=${nextOffset}&limit=${limitNum}`,
		}
	}

	newObj.meta = {
		total: totalNum,
		offset: offsetNum,
		limit: limitNum,
		hasNext: offsetNum + limitNum < totalNum,
		hasPrev: offsetNum > 0
	};

	return newObj;
}
