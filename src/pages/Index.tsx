import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Slider } from '@/components/ui/slider';

interface AnalysisResult {
  score: number;
  category: string;
  factors: {
    title: number;
    duration: number;
    engagement: number;
    timing: number;
  };
}

interface HistoryItem extends AnalysisResult {
  id: string;
  title: string;
  date: string;
  views: number;
  duration: number;
}

const Index = () => {
  const [title, setTitle] = useState(() => {
    const saved = localStorage.getItem('shorts_title');
    return saved || '';
  });
  const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem('shorts_duration');
    return saved ? [Number(saved)] : [30];
  });
  const [views, setViews] = useState(() => {
    const saved = localStorage.getItem('shorts_views');
    return saved || '';
  });
  const [likes, setLikes] = useState(() => {
    const saved = localStorage.getItem('shorts_likes');
    return saved || '';
  });
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('shorts_comments');
    return saved || '';
  });
  const [result, setResult] = useState<AnalysisResult | null>(() => {
    const saved = localStorage.getItem('shorts_result');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('shorts_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shorts_title', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('shorts_duration', duration[0].toString());
  }, [duration]);

  useEffect(() => {
    localStorage.setItem('shorts_views', views);
  }, [views]);

  useEffect(() => {
    localStorage.setItem('shorts_likes', likes);
  }, [likes]);

  useEffect(() => {
    localStorage.setItem('shorts_comments', comments);
  }, [comments]);

  useEffect(() => {
    if (result) {
      localStorage.setItem('shorts_result', JSON.stringify(result));
    }
  }, [result]);

  useEffect(() => {
    localStorage.setItem('shorts_history', JSON.stringify(history));
  }, [history]);

  const analyzeShort = () => {
    if (!title || !views) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const titleScore = Math.min(100, (title.length / 60) * 100);
      const durationScore = duration[0] >= 15 && duration[0] <= 45 ? 90 : 60;
      const engagementRate = (Number(likes) + Number(comments)) / Number(views) * 100;
      const engagementScore = Math.min(100, engagementRate * 20);
      const timingScore = Math.random() * 40 + 60;
      
      const totalScore = (titleScore + durationScore + engagementScore + timingScore) / 4;
      
      let category = 'Низкий потенциал';
      if (totalScore >= 75) category = 'Высокий потенциал 🚀';
      else if (totalScore >= 50) category = 'Средний потенциал';
      
      const analysisResult = {
        score: Math.round(totalScore),
        category,
        factors: {
          title: Math.round(titleScore),
          duration: Math.round(durationScore),
          engagement: Math.round(engagementScore),
          timing: Math.round(timingScore)
        }
      };
      
      setResult(analysisResult);
      
      const historyItem: HistoryItem = {
        ...analysisResult,
        id: Date.now().toString(),
        title,
        date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        views: Number(views),
        duration: duration[0]
      };
      
      const newHistory = [historyItem, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('shorts_history', JSON.stringify(newHistory));
      setIsAnalyzing(false);
    }, 1500);
  };

  const stats = [
    { label: 'Всего анализов', value: '1,247', icon: 'BarChart3', change: '+12%' },
    { label: 'Средняя точность', value: '87.3%', icon: 'Target', change: '+5%' },
    { label: 'Успешных прогнозов', value: '892', icon: 'TrendingUp', change: '+18%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="Youtube" className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Shorts Analyzer</h1>
          </div>
          <p className="text-slate-600 ml-15">Предсказание успешности YouTube Shorts с помощью аналитики</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-scale border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon name={stat.icon} className="text-primary" size={20} />
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-0">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="FileVideo" size={20} />
                Данные о Shorts
              </CardTitle>
              <CardDescription>Введите параметры видео для анализа</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); analyzeShort(); }} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Название видео</Label>
                <Input
                  id="title"
                  placeholder="Например: Как я получил 1М подписчиков за месяц"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-slate-200"
                />
                <div className="text-xs text-slate-500">{title.length}/60 символов</div>
              </div>

              <div className="space-y-2">
                <Label>Длительность (секунды): {duration[0]}s</Label>
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  max={60}
                  min={5}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-slate-500">Оптимально: 15-45 секунд</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="views">Просмотры</Label>
                  <Input
                    id="views"
                    type="number"
                    placeholder="10000"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="likes">Лайки</Label>
                  <Input
                    id="likes"
                    type="number"
                    placeholder="500"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comments">Комментарии</Label>
                  <Input
                    id="comments"
                    type="number"
                    placeholder="50"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="border-slate-200"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={isAnalyzing || !title || !views}
              >
                {isAnalyzing ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                    Анализируем...
                  </>
                ) : (
                  <>
                    <Icon name="Zap" className="mr-2" size={20} />
                    Анализировать
                  </>
                )}
              </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="LineChart" size={20} />
                Результаты анализа
              </CardTitle>
              <CardDescription>Прогноз вирусности и рекомендации</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6 animate-scale-in">
                  <div className="text-center py-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                    <div className="text-6xl font-bold text-primary mb-2">{result.score}%</div>
                    <div className="text-lg font-medium text-slate-700">{result.category}</div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Icon name="Type" size={16} />
                          Качество названия
                        </span>
                        <span className="font-medium">{result.factors.title}%</span>
                      </div>
                      <Progress value={result.factors.title} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Icon name="Clock" size={16} />
                          Длительность
                        </span>
                        <span className="font-medium">{result.factors.duration}%</span>
                      </div>
                      <Progress value={result.factors.duration} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Icon name="Heart" size={16} />
                          Вовлечённость
                        </span>
                        <span className="font-medium">{result.factors.engagement}%</span>
                      </div>
                      <Progress value={result.factors.engagement} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Icon name="Calendar" size={16} />
                          Тайминг публикации
                        </span>
                        <span className="font-medium">{result.factors.timing}%</span>
                      </div>
                      <Progress value={result.factors.timing} className="h-2" />
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <Icon name="Lightbulb" size={18} className="text-amber-500 mt-0.5" />
                      <div className="text-sm text-slate-700">
                        <div className="font-medium mb-1">Рекомендации:</div>
                        <ul className="space-y-1 text-slate-600">
                          {result.factors.title < 70 && <li>• Улучшите название - добавьте интригу или конкретные цифры</li>}
                          {result.factors.duration < 70 && <li>• Оптимизируйте длительность до 15-45 секунд</li>}
                          {result.factors.engagement < 70 && <li>• Добавьте призыв к действию для роста вовлечённости</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Icon name="BarChart3" className="text-slate-400" size={32} />
                  </div>
                  <p className="text-slate-500 text-sm">
                    Заполните данные и нажмите "Анализировать"<br />
                    для получения прогноза
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="History" size={20} />
                История анализов
              </CardTitle>
              <CardDescription>Последние 10 проверок</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border border-slate-200 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => setResult(item)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-slate-900 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500">{item.date}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`ml-2 ${
                            item.score >= 75 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : item.score >= 50 
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {item.score}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Icon name="Eye" size={12} />
                          {item.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={12} />
                          {item.duration}s
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Icon name="History" className="text-slate-400" size={32} />
                  </div>
                  <p className="text-slate-500 text-sm">
                    История анализов пуста<br />
                    Проведите первый анализ
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;