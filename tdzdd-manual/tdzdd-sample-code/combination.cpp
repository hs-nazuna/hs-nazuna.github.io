#include <iostream>
#include <tdzdd/DdSpec.hpp>
#include <tdzdd/DdStructure.hpp>

class Combination : public tdzdd::DdSpec<Combination, int, 2> {
	const int n;
	const int k;
public:
	Combination(int __n, int __k) : n(__n), k(__k) {}
	
	int getRoot(int& cnt) {
		cnt = 0;
		return n;
	}
	
	int getChild(int& cnt, int level, int take) const {
		cnt += take;
		if (cnt > k) return 0;
		if (cnt + level - 1 < k) return 0;
		--level;
		return (level == 0) ? -1 : level;
	}
};

int main() {
	Combination comb(10, 4);
	tdzdd::DdStructure< 2 > dd(comb);
	dd.zddReduce();
	std::cout << dd.zddCardinality() << std::endl;
}
