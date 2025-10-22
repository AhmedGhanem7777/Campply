import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Frown } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import { featuredCamps } from '@/data/camps';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const filteredCamps = featuredCamps.filter(camp => 
    camp.name.toLowerCase().includes(query) || 
    camp.location.toLowerCase().includes(query)
  );

  return (
    <PageTransition>
      <Helmet>
        <title>نتائج البحث عن "{query}" | Camply</title>
        <meta name="description" content={`نتائج البحث عن مخيمات تطابق "${query}".`} />
      </Helmet>

      <div className="container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">نتائج البحث</h1>
          <p className="text-lg text-muted-foreground">
            {filteredCamps.length > 0 
              ? `تم العثور على ${filteredCamps.length} مخيم يطابق بحثك عن "${query}"`
              : `لم يتم العثور على نتائج تطابق بحثك عن "${query}"`}
          </p>
        </motion.div>

        {filteredCamps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCamps.map((camp, index) => (
              <motion.div
                key={camp.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group">
                  <CardHeader className="p-0">
                    <div className="relative h-56">
                      <img className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={camp.name} src="https://images.unsplash.com/photo-1532555283690-cbf89e69cec7" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="mb-2 text-xl">{camp.name}</CardTitle>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {camp.location}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="font-bold text-primary">{camp.price}</span>
                    <Button variant="secondary" asChild>
                      <Link to={`/camps/${camp.id}`}>عرض التفاصيل</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 flex flex-col items-center"
          >
            <Frown className="h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">لا توجد نتائج</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              حاول استخدام كلمات بحث مختلفة أو تصفح المخيمات المميزة في الصفحة الرئيسية.
            </p>
            <Button asChild>
              <Link to="/">العودة إلى الرئيسية</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default SearchResults;